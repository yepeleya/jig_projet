import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import { z } from 'zod'
import { NotificationService } from '../services/notification.service.js'

const prisma = new PrismaClient()

// Schéma de validation
const contactSchema = z.object({
  nom: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Email invalide'),
  sujet: z.string().min(5, 'Le sujet doit contenir au moins 5 caractères'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères')
})

export class ContactController {
  // Créer un nouveau message de contact
  static async createContact(req, res, next) {
    try {
      const validatedData = contactSchema.parse(req.body)
      
      const contact = await prisma.contact.create({
        data: {
          ...validatedData,
          statut: 'NOUVEAU'
        }
      })

      res.status(201).json({
        success: true,
        message: 'Message envoyé avec succès',
        data: contact
      })
    } catch (error) {
      next(error)
    }
  }

  // Récupérer tous les messages de contact (admin)
  static async getAllContacts(req, res, next) {
    try {
      const { statut, page = 1, limit = 10 } = req.query
      
      const where = {}
      if (statut) where.statut = statut

      const skip = (page - 1) * limit

      const [contacts, total] = await Promise.all([
        prisma.contact.findMany({
          where,
          include: {
            user: {
              select: {
                id: true,
                nom: true,
                prenom: true,
                email: true
              }
            }
          },
          orderBy: { createdAt: 'desc' },
          skip: parseInt(skip),
          take: parseInt(limit)
        }),
        prisma.contact.count({ where })
      ])

      res.json({
        success: true,
        data: {
          contacts,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total,
            pages: Math.ceil(total / limit)
          }
        }
      })
    } catch (error) {
      next(error)
    }
  }

  // Récupérer un message par ID (admin)
  static async getContactById(req, res, next) {
    try {
      const { id } = req.params
      
      const contact = await prisma.contact.findUnique({
        where: { id: parseInt(id) },
        include: {
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true
            }
          }
        }
      })

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Message non trouvé'
        })
      }

      res.json({
        success: true,
        data: contact
      })
    } catch (error) {
      next(error)
    }
  }

  // Mettre à jour un message (admin)
  static async updateContact(req, res, next) {
    try {
      const { id } = req.params
      const { statut, reponse } = req.body

      const data = {}
      if (statut) data.statut = statut
      if (reponse) data.reponse = reponse

      const contact = await prisma.contact.update({
        where: { id: parseInt(id) },
        data,
        include: {
          user: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true
            }
          }
        }
      })

      res.json({
        success: true,
        message: 'Message mis à jour avec succès',
        data: contact
      })
    } catch (error) {
      next(error)
    }
  }

  // Supprimer un message (admin)
  static async deleteContact(req, res, next) {
    try {
      const { id } = req.params
      
      const contact = await prisma.contact.findUnique({
        where: { id: parseInt(id) }
      })

      if (!contact) {
        return res.status(404).json({
          success: false,
          message: 'Message non trouvé'
        })
      }

      await prisma.contact.delete({
        where: { id: parseInt(id) }
      })

      res.json({
        success: true,
        message: 'Message supprimé avec succès'
      })
    } catch (error) {
      next(error)
    }
  }

  // Obtenir les statistiques des contacts (admin)
  static async getContactStats(req, res, next) {
    try {
      const stats = await prisma.contact.groupBy({
        by: ['statut'],
        _count: {
          statut: true
        }
      })

      const total = await prisma.contact.count()

      const formattedStats = {
        total,
        parStatut: stats.reduce((acc, stat) => {
          acc[stat.statut] = stat._count.statut
          return acc
        }, {})
      }

      res.json({
        success: true,
        data: formattedStats
      })
    } catch (error) {
      next(error)
    }
  }
}