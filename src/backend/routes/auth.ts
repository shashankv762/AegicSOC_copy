import { Router } from "express";
import { db } from "../database.js";
import { authUtils } from "../utils/auth.js";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE username = ?").get(username) as any;

    if (!user || !(await authUtils.comparePassword(password, user.password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    const token = authUtils.generateToken(user);
    res.json({ 
      token, 
      user: { id: user.id, username: user.username, role: user.role } 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
