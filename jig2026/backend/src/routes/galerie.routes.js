import express from "express";

const router = express.Router();

// Routes temporaires pour éviter les erreurs
router.get("/", (req, res) => {
  res.json({ message: "Route galerie - à implémenter" });
});

router.post("/", (req, res) => {
  res.json({ message: "Upload image - à implémenter" });
});

export default router;
