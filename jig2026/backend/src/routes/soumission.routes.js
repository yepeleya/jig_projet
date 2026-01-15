import express from "express";

const router = express.Router();

// Routes temporaires pour éviter les erreurs
router.get("/", (req, res) => {
  res.json({ message: "Route soumissions - à implémenter" });
});

router.post("/", (req, res) => {
  res.json({ message: "Création soumission - à implémenter" });
});

export default router;
