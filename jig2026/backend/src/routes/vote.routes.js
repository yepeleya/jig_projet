import express from "express";
import { 
  voter, 
  getVotesByProjet, 
  calculerScores, 
  getMyVotes,
  getAllVotes,
  getVoteResults,
  getFinalResults
} from "../controllers/vote.controller.js";
import { authenticateToken } from '../middlewares/auth.middleware.js'

const router = express.Router();

router.post("/", authenticateToken, voter);           // Voter sur un projet (authentifié)
router.get("/", getAllVotes);                         // Liste complète des votes
router.get("/my-votes", authenticateToken, getMyVotes); // Mes votes (authentifié)
router.get("/results", getVoteResults);               // Projets triés par nombre de votes
router.get("/final-results", getFinalResults);       // Résultats finaux avec pondération
router.get("/scores/all", calculerScores);            // Calculer les scores globaux (legacy)
router.get("/:projetId", getVotesByProjet);           // Voir les votes d'un projet

export default router;
