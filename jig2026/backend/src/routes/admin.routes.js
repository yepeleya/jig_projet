import express from "express";
import { 
  getAllUsers, 
  getAllProjects, 
  getAllJury, 
  getStats,
  deleteUser,
  updateUser,
  createJury,
  deleteJury,
  deleteProject,
  updateProjectStatus,
  // Nouvelles fonctions pour le profil admin
  getAdminProfile,
  updateAdminProfile,
  uploadAdminAvatar,
  deleteAdminAvatar,
  // Nouvelles fonctions pour la gestion des votes
  getAllVotes,
  deleteVote,
  // Fonction d'export
  exportData
} from "../controllers/admin.controller.js";
import { corrigerStatutsProjetsExistants, afficherResumeStatuts } from '../utils/correctionStatuts.js';
import { authenticateToken, isAdmin } from "../middlewares/auth.middleware.js";
import { uploadAvatar } from "../middlewares/upload.middleware.js";

const router = express.Router();

// Middleware pour vérifier que l'utilisateur est admin sur toutes les routes
router.use(authenticateToken);
router.use(isAdmin);

// ===== GESTION DU PROFIL ADMINISTRATEUR =====
router.get("/profile", getAdminProfile);
router.put("/profile", updateAdminProfile);
router.post("/profile/avatar", uploadAvatar, uploadAdminAvatar);
router.delete("/profile/avatar", deleteAdminAvatar);

// ===== GESTION DES UTILISATEURS =====
// Gestion des utilisateurs avec filtres
router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUser);
router.put("/users/:id", updateUser);

// Gestion spécifique des jurys
router.get("/jury", getAllJury);
router.post("/jury", createJury);
router.delete("/jury/:id", deleteJury);

// Gestion des projets
router.get("/projects", getAllProjects);
router.delete("/projects/:id", deleteProject);
router.patch("/projects/:id/status", updateProjectStatus);

// Gestion des votes
router.get("/votes", getAllVotes);
router.delete("/votes/:id", deleteVote);

// Statistiques globales
router.get("/stats", getStats);

// Export des données
router.get("/export/:type", exportData);

// ===== CORRECTION DES STATUTS =====
/**
 * Corriger rétroactivement les statuts des projets existants
 * GET /api/admin/corriger-statuts
 */
router.get('/corriger-statuts', async (req, res) => {
  try {
    console.log("🚀 Lancement de la correction des statuts...");
    
    // Afficher le résumé avant correction
    console.log("📊 État AVANT correction:");
    await afficherResumeStatuts();
    
    // Effectuer la correction
    const resultat = await corrigerStatutsProjetsExistants();
    
    // Afficher le résumé après correction
    console.log("📊 État APRÈS correction:");
    await afficherResumeStatuts();
    
    res.json({
      success: true,
      message: "Correction des statuts terminée avec succès",
      data: resultat
    });
  } catch (error) {
    console.error("❌ Erreur lors de la correction:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de la correction des statuts",
      error: error.message
    });
  }
});

/**
 * Afficher le résumé des statuts actuels
 * GET /api/admin/resume-statuts
 */
router.get('/resume-statuts', async (req, res) => {
  try {
    const resume = await afficherResumeStatuts();
    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error("❌ Erreur lors de l'affichage du résumé:", error);
    res.status(500).json({
      success: false,
      message: "Erreur lors de l'affichage du résumé",
      error: error.message
    });
  }
});

export default router;