import { db } from "../database.js";
import { alertService } from "./alert_service.js";
import { featureExtractor } from "../../ai/feature_extractor.js";
import { anomalyDetector } from "../../ai/anomaly_detector.js";
import { explainer } from "../../ai/explainer.js";

export const logService = {
  processAndSaveLog: async (logData: any) => {
    // 1. Extract features
    const features = featureExtractor.extract(logData);
    
    // 2. Predict anomaly
    const [isAnomaly, score] = anomalyDetector.predict(features);
    
    // 3. Save log
    const logId = logService.createLog({
      ...logData,
      is_anomaly: isAnomaly
    });
    
    let alertId = null;
    if (isAnomaly) {
      // 4. Generate explanation and mitigations
      const reason = explainer.explain(logData, score);
      const mitigations = explainer.suggestMitigations(logData);
      
      // Assign severity
      let severity = "Low";
      if (score > 0.7) severity = "Critical";
      else if (score > 0.4) severity = "Medium";
      
      // 5. Create alert
      alertId = alertService.createAlert({
        log_id: logId,
        severity,
        reason,
        score,
        mitigations
      });
    }
    
    return { log_id: logId, is_anomaly: isAnomaly, alert_id: alertId };
  },

  createLog: (log: any) => {
    const stmt = db.prepare(`
      INSERT INTO logs (source_ip, event_type, username, status_code, payload, is_anomaly)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      log.source_ip,
      log.event_type,
      log.username,
      log.status_code,
      JSON.stringify(log.payload || {}),
      log.is_anomaly ? 1 : 0
    );
    return info.lastInsertRowid;
  },

  getLogs: (limit = 100, offset = 0, anomalyOnly = false) => {
    let query = "SELECT * FROM logs";
    if (anomalyOnly) query += " WHERE is_anomaly = 1";
    query += " ORDER BY timestamp DESC LIMIT ? OFFSET ?";
    return db.prepare(query).all(limit, offset);
  },

  getStats: () => {
    try {
      const totalLogs = db.prepare("SELECT COUNT(*) as count FROM logs").get() as any;
      const anomaliesToday = db.prepare("SELECT COUNT(*) as count FROM logs WHERE is_anomaly = 1 AND timestamp >= date('now')").get() as any;
      const eventsByType = db.prepare("SELECT event_type, COUNT(*) as count FROM logs GROUP BY event_type").all() as any[];
      const processCount = db.prepare("SELECT COUNT(*) as count FROM processes").get() as any;
      const networkCount = db.prepare("SELECT COUNT(*) as count FROM network_connections").get() as any;
      
      // Last 24h timeline
      const timeline = db.prepare(`
        SELECT strftime('%H', timestamp) as hour, COUNT(*) as count 
        FROM logs 
        WHERE timestamp >= datetime('now', '-24 hours')
        GROUP BY hour
        ORDER BY hour ASC
      `).all() as any[];

      return {
        total_logs: totalLogs?.count || 0,
        anomalies_today: anomaliesToday?.count || 0,
        process_count: processCount?.count || 0,
        network_count: networkCount?.count || 0,
        events_per_type: eventsByType.reduce((acc, curr) => ({ ...acc, [curr.event_type]: curr.count }), {}),
        timeline: timeline.map(t => ({ hour: parseInt(t.hour), count: t.count }))
      };
    } catch (err) {
      console.error("Database error in getStats:", err);
      return {
        total_logs: 0,
        anomalies_today: 0,
        events_per_type: {},
        timeline: []
      };
    }
  }
};
