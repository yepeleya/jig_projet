'use client'

import { Logo } from './Logo'
import { JIG_CLASSES } from '@/lib/design-system'
import { Mail, Phone, MapPin, Globe } from 'lucide-react'

export function Footer() {
  return (
    <footer className={`${JIG_CLASSES.bgSecondary} text-white`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo et description */}
          <div className="col-span-1 md:col-span-1">
            <Logo variant="white" size="md" className="mb-4" />
            <p className="text-gray-300 text-sm leading-relaxed">
              Interface jury pour la Journée de l&pos;Infographiste 2026
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300 text-sm">
                <Mail className={`w-4 h-4 mr-3 text-[#9E1B32]`} />
                <span>jury@jig2026.ci</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <Phone className={`w-4 h-4 mr-3 text-[#9E1B32]`} />
                <span>+225 XX XX XX XX XX</span>
              </div>
              <div className="flex items-center text-gray-300 text-sm">
                <MapPin className={`w-4 h-4 mr-3 text-[#9E1B32]`} />
                <span>Abidjan, Côte d&apos;Ivoire</span>
              </div>
            </div>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Support</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-300 text-sm hover:text-white transition-colors hover:pl-2 duration-200">
                Guide d&apos;évaluation
              </a>
              <a href="#" className="block text-gray-300 text-sm hover:text-white transition-colors hover:pl-2 duration-200">
                Critères de notation
              </a>
              <a href="#" className="block text-gray-300 text-sm hover:text-white transition-colors hover:pl-2 duration-200">
                Support technique
              </a>
              <a href="#" className="block text-gray-300 text-sm hover:text-white transition-colors hover:pl-2 duration-200">
                Contact administrateur
              </a>
            </div>
          </div>
        </div>

        {/* Ligne de séparation */}
        <div className="border-t border-gray-600 mt-6 pt-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-xs mb-2 md:mb-0">
              © 2026 JIG - Interface Jury. Tous droits réservés.
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-400 text-xs">
                Plateforme sécurisée
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}