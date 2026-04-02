import { Router } from "express";
import { systemService } from "../services/system_service.js";
import { authMiddleware } from "../middleware/auth.js";

const router = Router();

// Endpoint for the Python agent to send data
router.post("/system-data", async (req, res) => {
  try {
    const data = req.body;
    // Data validation could be added here
    await systemService.processData(data);
    res.json({ status: "ok" });
  } catch (error) {
    console.error("System data error:", error);
    res.status(500).json({ error: "Failed to process system data" });
  }
});

// Protected endpoints for the dashboard
router.use(authMiddleware);

router.get("/processes", (req, res) => {
  try {
    const processes = systemService.getProcesses();
    res.json(processes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch processes" });
  }
});

router.get("/network", (req, res) => {
  try {
    const network = systemService.getNetworkConnections();
    res.json(network);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch network connections" });
  }
});

export default router;
