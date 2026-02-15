'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Calendar, MapPin, Users, Award, Star, Palette } from 'lucide-react'
import useAOS from '../hooks/useAOS'

export default function AfficheOfficielle() {
  useAOS()

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Titre de la section */}
        <div data-aos="fade-up" className="text-center mb-12">
          <div className="inline-flex items-center justify-center bg-gradient-to-r from-jig-primary to-red-600 text-white px-6 py-3 rounded-full shadow-lg mb-6">
            <Palette className="w-5 h-5 mr-2" />
            <h2 className="text-xl font-semibold">Affiche Officielle JIG 2026</h2>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Colonne de gauche - Texte officiel */}
          <div data-aos="fade-right" className="order-2 lg:order-1">
            <div className="bg-gradient-to-br from-jig-primary to-red-700 text-white rounded-2xl p-8 shadow-2xl">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🎨</div>
                <h3 className="text-3xl font-bold mb-4 leading-tight">
                  Célébrons l'Art Digital : La Journée de l'Infographiste !
                </h3>
              </div>

              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  Pour sa <strong>12ème édition</strong>, la Journée de l'Infographiste vous invite à explorer la fusion entre don naturel et savoir-faire technique.
                </p>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Star className="w-6 h-6 mr-2 text-yellow-300" />
                    <strong className="text-xl">Thème :</strong>
                  </div>
                  <p className="italic text-yellow-100 pl-8">
                    « Quand la créativité devient une compétence : Le talent comme toile, la compétence comme pinceau. »
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Award className="w-6 h-6 mr-2 text-orange-300" />
                    <strong className="text-xl">Parrain d'exception :</strong>
                  </div>
                  <p className="pl-8">
                    <strong>Maurel Kouadio</strong>, Artiste 3D & Motion Designer.
                  </p>
                </div>

                <div className="border-t border-white/20 pt-6">
                  <h4 className="text-2xl font-bold mb-4 flex items-center">
                    <MapPin className="w-6 h-6 mr-2" />
                    Infos Pratiques
                  </h4>
                  
                  <div className="space-y-3 pl-8">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-3 text-green-300" />
                      <span><strong>Date :</strong> 20 Février 2026</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-blue-300" />
                      <span><strong>Lieu :</strong> À l'ISTC Polytechnique</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="w-5 h-5 mr-3 text-purple-300" />
                      <span><strong>Au programme :</strong> Panels inspirants, Masterclasses inédites, Expositions et Remise de prix.</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-lg p-4 border-l-4 border-yellow-400">
                  <p className="text-center font-medium">
                    Que vous soyez étudiant, professionnel ou simplement curieux de l'univers du design, 
                    venez nourrir votre inspiration et échanger avec les meilleurs du domaine !
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Colonne de droite - Affiche officielle */}
          <div data-aos="fade-left" className="order-1 lg:order-2">
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6 overflow-hidden">
                <div className="relative w-full max-w-md mx-auto">
                  <Image
                    src="/affiche/affiche_officiel.jpeg"
                    alt="Affiche officielle JIG 2026 - Célébrons l'Art Digital"
                    width={400}
                    height={600}
                    className="w-full h-auto object-contain rounded-xl shadow-lg"
                    priority
                    style={{ aspectRatio: 'auto' }}
                  />
                </div>
                <div className="text-center mt-6">
                  <h4 className="text-xl font-bold text-gray-800">Affiche Officielle JIG 2026</h4>
                  <p className="text-gray-600">12ème Édition</p>
                </div>
              </div>
              
              {/* Décoration */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-jig-primary to-red-600 rounded-full shadow-lg flex items-center justify-center text-white">
                <Palette className="w-6 h-6" />
              </div>
            </div>
          </div>

        </div>

        {/* Bouton d'action */}
        <div data-aos="fade-up" data-aos-delay="600" className="text-center mt-12">
          <a 
            href="#programme" 
            className="inline-flex items-center bg-gradient-to-r from-jig-primary to-red-600 text-white font-semibold px-8 py-4 rounded-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Découvrir le Programme Complet
          </a>
        </div>

      </div>
    </section>
  )
}