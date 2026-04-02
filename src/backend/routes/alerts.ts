import { Router } from "express";
import { alertService } from "../services/alert_service.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

router.use(authMiddleware);

router.get("/", (req, res) => {
  try {
    const severity = req.query.severity as string;
    const acknowledged = req.query.acknowledged === undefined ? undefined : req.query.acknowledged === 'true';
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = parseInt(req.query.offset as string) || 0;
    
    const alerts = alertService.getAlerts(severity, acknowledged, limit, offset);
    res.json(alerts);
  } catch (error) {
    console.error("Error in GET /api/alerts:", error);
    res.status(500).json({ error: "Internal server error", details: error instanceof Error ? error.message : String(error) });
  }
});

router.get("/:id", (req, res) => {
  const alert = alertService.getAlertById(parseInt(req.params.id));
  if (!alert) return res.status(404).json({ error: "Alert not found" });
  res.json(alert);
});

router.patch("/:id/acknowledge", (req, res) => {
  const acknowledged = req.body.acknowledged === true;
  const alert = alertService.acknowledgeAlert(parseInt(req.params.id), acknowledged);
  res.json(alert);
});

export default router;
