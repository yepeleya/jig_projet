import prisma from "../utils/prismaClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const inscription = async (req, res) => {
  try {
    const { nom, prenom, email, motDePasse, role } = req.body;
    const hash = await bcrypt.hash(motDePasse, 10);
    const user = await prisma.user.create({
      data: { nom, prenom, email, motDePasse: hash, role },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const connexion = async (req, res) => {
  try {
    const { email, motDePasse } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    const valid = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!valid) return res.status(401).json({ message: "Mot de passe incorrect" });
    const secret = process.env.JWT_SECRET || 'jig2026_super_secret_key_production_railway_xyz123ABC';
    const token = jwt.sign({ id: user.id, role: user.role }, secret, { expiresIn: "7d" });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
