'use client'

import { Mail, Phone, MapPin, Heart } from 'lucide-react'
import { useState, useEffect } from 'react'
import Logo from './Logo'

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(2026)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentYear(new Date().getFullYear())
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <footer id="contact" className="relative bg-gradient-to-br from-jig-primary via-red-600 to-red-700 text-white overflow-hidden">
      
      {/* Motifs décoratifs en arrière-plan */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 w-32 h-32 bg-white rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-white rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-white rounded-full blur-lg"></div>
      </div>

      {/* Vague décorative en haut */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-current text-gray-50 transform rotate-180">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-8">
        
        {/* Section principale */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-12">
          
          {/* Logo et description centrés */}
          <div className="lg:col-span-3 text-center mb-8">
            
            {/* Logo JIG centré */}
            <div className="flex justify-center mb-6">
              <div className="flex items-center space-x-4">
                <Logo variant="white" size="lg" />
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-2">
              Journée de l&apos;Infographiste — Édition 2026
            </h3>
            <p className="text-red-100 max-w-2xl mx-auto leading-relaxed">
              Un événement unique célébrant la créativité, l&apos;innovation et l&apos;excellence 
              dans le domaine de l&apos;infographie et du design numérique.
            </p>

          </div>

          {/* Coordonnées - Email */}
          <div className="text-center lg:text-left">
            <h4 className="text-lg font-semibold mb-4 flex items-center justify-center lg:justify-start">
              <Mail className="w-5 h-5 mr-2" />
              Contact Email
            </h4>
            <div className="space-y-2 text-red-100">
              <a href="mailto:jigeain@gmail.com" className="hover:text-white transition-colors flex items-center justify-center lg:justify-start">
                jigeain@gmail.com
              </a>
            </div>
          </div>

          {/* Coordonnées - Téléphone */}
          <div className="text-center lg:text-left">
            <h4 className="text-lg font-semibold mb-4 flex items-center justify-center lg:justify-start">
              <Phone className="w-5 h-5 mr-2" />
              Téléphone
            </h4>
            <div className="space-y-2 text-red-100">
              <a href="tel:+22578793501" className="hover:text-white transition-colors flex items-center justify-center lg:justify-start">
                +225 78 79 35 01
              </a>
              <a href="tel:+22501020304" className="hover:text-white transition-colors flex items-center justify-center lg:justify-start">
                +225 01 02 03 04
              </a>
            </div>
          </div>

          {/* Coordonnées - Adresse */}
          <div className="text-center lg:text-left">
            <h4 className="text-lg font-semibold mb-4 flex items-center justify-center lg:justify-start">
              <MapPin className="w-5 h-5 mr-2" />
              Adresse
            </h4>
            <div className="text-red-100 space-y-1">
              <p>Cité des Arts</p>
              <p>ISTC Polytechnique</p>
              <p>Cocody, Abidjan</p>
              <p>Côte d&apos;Ivoire</p>
            </div>
          </div>

        </div>

        {/* Séparateur */}
        <div className="border-t border-red-400/30 pt-8">
          
          {/* Conception et copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-red-100">
            
            <div className="flex items-center mb-4 md:mb-0">
              <span>Conception : Yéo Tenena</span>
            </div>

            <div className="flex items-center space-x-1">
              <span>© {currentYear} Journée de l&apos;Infographiste | ISTC Polytechnique</span>
            </div>

            <div className="flex items-center space-x-1 mt-4 md:mt-0">
              <span>Fait avec</span>
              <Heart className="w-4 h-4 text-red-300 fill-current" />
              <span>par l&apos;équipe EAIN</span>
            </div>

          </div>

        </div>

      </div>

      {/* Motif géométrique en bas */}
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-red-800 via-jig-primary to-red-800"></div>
      
    </footer>
  )
}