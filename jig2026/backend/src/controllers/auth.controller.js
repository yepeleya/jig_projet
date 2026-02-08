import { AuthService } from '../services/auth.service.js'
import { NotificationService } from '../services/notification.service.js'
import { z } from 'zod'

// Schémas de validation - Champs de base uniquement
const registerSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  role: z.enum(['ADMIN', 'ETUDIANT', 'JURY', 'VISITEUR']).default('VISITEUR')
})

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis')
})

const jurySchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  prenom: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères')
})

export class AuthController {
  // Inscription d'un utilisateur
  static async register(req, res, next) {
    try {
      const validatedData = registerSchema.parse(req.body)
      
      const result = await AuthService.register(validatedData)
      
      // Créer une notification pour le nouvel utilisateur
      await NotificationService.onNewUser(result.user)
      
      res.status(201).json({
        success: true,
        message: 'Inscription réussie',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  // Connexion
  static async login(req, res, next) {
    try {
      const { email, password } = loginSchema.parse(req.body)
      
      const result = await AuthService.login(email, password)
      
      res.json({
        success: true,
        message: 'Connexion réussie',
        data: result
      })
    } catch (error) {
      next(error)
    }
  }

  // Créer un jury (admin seulement)
  static async createJury(req, res, next) {
    try {
      const validatedData = jurySchema.parse(req.body)
      
      const jury = await AuthService.createJury(validatedData)
      
      // Créer une notification pour le nouveau jury
      await NotificationService.onNewJury(jury)
      
      res.status(201).json({
        success: true,
        message: 'Jury créé avec succès',
        data: jury
      })
    } catch (error) {
      next(error)
    }
  }

  // Récupérer le profil de l'utilisateur connecté
  static async getProfile(req, res, next) {
    try {
      res.json({
        success: true,
        data: req.user
      })
    } catch (error) {
      next(error)
    }
  }

  // Mettre à jour le profil
  static async updateProfile(req, res, next) {
    try {
      const { nom, prenom, email } = req.body
      
      const updatedUser = await AuthService.updateProfile(
        req.user.id,
        { nom, prenom, email }
      )
      
      res.json({
        success: true,
        message: 'Profil mis à jour avec succès',
        data: updatedUser
      })
    } catch (error) {
      next(error)
    }
  }

  // Changer le mot de passe
  static async changePassword(req, res, next) {
    try {
      const { oldPassword, newPassword } = req.body
      
      if (!oldPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Ancien et nouveau mot de passe requis'
        })
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Le nouveau mot de passe doit contenir au moins 6 caractères'
        })
      }

      await AuthService.changePassword(
        req.user.id, 
        oldPassword, 
        newPassword
      )
      
      res.json({
        success: true,
        message: 'Mot de passe mis à jour avec succès'
      })
    } catch (error) {
      next(error)
    }
  }

  // Déconnexion (côté client, suppression du token)
  static async logout(req, res) {
    res.json({
      success: true,
      message: 'Déconnexion réussie'
    })
  }

  // Vérifier le token
  static async verifyToken(req, res, next) {
    try {
      // Si on arrive ici, c'est que le middleware d'auth a validé le token
      res.json({
        success: true,
        data: req.user
      })
    } catch (error) {
      next(error)
    }
  }
}

// Exports compatibles avec l'ancienne version
export const register = AuthController.register
export const login = AuthController.login
export const me = AuthController.getProfile

export default { register, login, me }
