import express from "express";
import { inscription, connexion } from "../controllers/user.controller.js";
const router = express.Router();

router.post("/register", inscription);
router.post("/login", connexion);

export default router;
