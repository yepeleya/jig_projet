import express from "express";
import { ajouterCommentaire, getCommentaires, getCommentairesByProjet } from "../controllers/commentaire.controller.js";

const router = express.Router();

router.post("/", ajouterCommentaire);
router.get("/", getCommentaires);
router.get("/:projetId", getCommentairesByProjet);

export default router;