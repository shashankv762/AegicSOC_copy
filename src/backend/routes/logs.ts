import { Router } from "express";
import { logService } from "../services/log_service.js";
import { alertService } from "../services/alert_service.js";
import { featureExtractor } from "../../ai/feature_extractor.js";
import { anomalyDetector } from "../../ai/anomaly_detector.js";
import { explainer } from "../../ai/explainer.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const logData = req.body;
    
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
    
    res.json({ log_id: logId, is_anomaly: isAnomaly, alert_id: alertId });
  } catch (error) {
    console.error("Error processing log:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", authMiddleware, (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 100;
    const offset = parseInt(req.query.offset as string) || 0;
    const anomalyOnly = req.query.anomaly_only === 'true';
    
    const logs = logService.getLogs(limit, offset, anomalyOnly);
    res.json(logs);
  } catch (error) {
    console.error("Error in GET /api/logs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/stats", authMiddleware, (req, res) => {
  try {
    const stats = logService.getStats();
    res.json(stats);
  } catch (error) {
    console.error("Error in GET /api/logs/stats:", error);
    res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) });
  }
});

export default router;
