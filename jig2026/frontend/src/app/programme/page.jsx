'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { 
  FaAward, 
  FaUsers, 
  FaLaptopCode, 
  FaComments, 
  FaTrophy,
  FaClock,
  FaMapMarkerAlt,
  FaCalendarAlt
} from 'react-icons/fa'
import AOS from 'aos'

export default function ProgrammePage() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  const programmeEvents = [
    {
      id: 1,
      time: "8h30 - 9h",
      title: "Ouverture officielle",
      description: "Cérémonie d&apos;ouverture et mot du Directeur Général de l&apos;ISTC Polytechnique.",
      icon: FaAward,
      animation: "fade-right",
      color: "from-red-500 to-red-600"
    },
    {
      id: 2,
      time: "9h - 12h",
      title: "Démonstrations et Expositions",
      description: "Présentation des travaux étudiants (PAO, Web, Animation, Photographie).",
      icon: FaLaptopCode,
      animation: "fade-left",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 3,
      time: "14h - 16h",
      title: "Masterclasses",
      description: "Ateliers techniques animés par des professionnels des arts et images numériques.",
      icon: FaUsers,
      animation: "fade-right",
      color: "from-green-500 to-green-600"
    },
    {
      id: 4,
      time: "16h - 17h30",
      title: "Panel de discussion",
      description: "Échanges entre experts sur les métiers créatifs et les tendances du numérique.",
      icon: FaComments,
      animation: "fade-left",
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 5,
      time: "17h30 - 18h",
      title: "Remise de prix",
      description: "Récompense des meilleurs projets étudiants.",
      icon: FaTrophy,
      animation: "fade-right",
      color: "from-yellow-500 to-yellow-600"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Bannière titre avec fond diagonal */}
      <section className="relative overflow-hidden bg-gradient-to-br from-jig-primary via-red-600 to-red-700 pt-20">
        
        {/* Effet diagonal */}
        <div className="absolute inset-0 bg-gradient-to-br from-jig-primary/90 via-red-600/90 to-red-700/90 transform skew-y-1 origin-top-left"></div>
        
        {/* Motifs décoratifs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full blur-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center text-white">
          <div data-aos="fade-up">
            <div className="mb-6">
              <FaCalendarAlt className="text-6xl mx-auto mb-4 opacity-80" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Programme de la Journée
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              Découvrez le déroulement complet de la JIG 2026 !
            </p>
            
            {/* Informations pratiques */}
            <div className="mt-12 grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <FaMapMarkerAlt className="text-2xl mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Lieu</h3>
                <p className="text-red-100 text-sm">ISTC Polytechnique, Cocody</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <FaClock className="text-2xl mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Durée</h3>
                <p className="text-red-100 text-sm">8h30 - 18h00</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline verticale centrale */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          
          {/* Introduction */}
          <div data-aos="fade-up" className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Déroulement de la journée
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Une journée complète d&apos;activités enrichissantes pour découvrir et approfondir vos connaissances en infographie.
            </p>
          </div>

          {/* Timeline container */}
          <div className="relative">
            
            {/* Ligne verticale centrale */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-jig-primary via-red-400 to-jig-primary h-full hidden md:block"></div>
            
            {/* Timeline mobile line */}
            <div className="absolute left-8 w-1 bg-gradient-to-b from-jig-primary via-red-400 to-jig-primary h-full md:hidden"></div>

            {/* Events */}
            <div className="space-y-12">
              {programmeEvents.map((event, index) => {
                const IconComponent = event.icon
                const isLeft = index % 2 === 0
                
                return (
                  <div key={event.id} className="relative">
                    
                    {/* Point central (desktop) */}
                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-jig-primary rounded-full z-10 hidden md:block" style={{ top: '2rem' }}></div>
                    
                    {/* Point mobile */}
                    <div className="absolute left-6 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-jig-primary rounded-full z-10 md:hidden" style={{ top: '2rem' }}></div>
                    
                    {/* Carte événement */}
                    <div className={`md:w-1/2 ${isLeft ? 'md:pr-12' : 'md:ml-1/2 md:pl-12'} ml-16 md:ml-0`}>
                      <div 
                        data-aos={event.animation}
                        data-aos-delay={index * 100}
                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-l-4 border-jig-primary overflow-hidden"
                      >
                        
                        {/* Header avec icône et temps */}
                        <div className={`bg-gradient-to-r ${event.color} p-6 text-white`}>
                          <div className="flex items-center space-x-4">
                            <div className="bg-white/20 p-3 rounded-full">
                              <IconComponent className="text-2xl" />
                            </div>
                            <div>
                              <div className="text-sm opacity-90 font-medium">
                                {event.time}
                              </div>
                              <h3 className="text-xl font-bold">
                                {event.title}
                              </h3>
                            </div>
                          </div>
                        </div>
                        
                        {/* Contenu */}
                        <div className="p-6">
                          <p className="text-gray-700 leading-relaxed">
                            {event.description}
                          </p>
                          
                          {/* Indicateurs supplémentaires */}
                          <div className="mt-4 flex items-center text-sm text-gray-500">
                            <FaClock className="w-4 h-4 mr-2" />
                            <span>Durée estimée : {
                              event.time.includes('8h30') ? '30 min' :
                              event.time.includes('9h - 12h') ? '3h' :
                              event.time.includes('14h') ? '2h' :
                              event.time.includes('16h') ? '1h30' :
                              '30 min'
                            }</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section call-to-action */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div data-aos="zoom-in" className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            
            {/* Icône centrale */}
            <div className="text-6xl mb-6">🎨</div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Ne manquez pas cette journée !
            </h2>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Rejoignez-nous pour vivre une journée unique dédiée à la créativité et à l&apos;innovation visuelle. 
              Une opportunité exceptionnelle de découvrir les métiers de l&apos;infographie et de rencontrer des professionnels passionnés.
            </p>
            
            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-jig-primary mb-2">500+</div>
                <div className="text-sm text-gray-600">Participants attendus</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-jig-primary mb-2">20+</div>
                <div className="text-sm text-gray-600">Intervenants experts</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-jig-primary mb-2">10h</div>
                <div className="text-sm text-gray-600">D&apos;activités non-stop</div>
              </div>
            </div>
            
            {/* Boutons d&apos;action */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/galerie">
                <button className="bg-gradient-to-r from-jig-primary to-red-600 text-white font-semibold px-8 py-4 rounded-full hover:from-red-600 hover:to-jig-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  Voir la galerie
                </button>
              </Link>
              
              <Link href="/soumettre">
                <button className="border-2 border-jig-primary text-jig-primary font-semibold px-8 py-4 rounded-full hover:bg-jig-primary hover:text-white transition-all duration-300 shadow-lg">
                  Soumettre un projet
                </button>
              </Link>
            </div>
            
            {/* Contact rapide */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500 mb-2">Des questions ? Contactez-nous :</p>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 text-sm">
                <a href="mailto:jig@istc.edu" className="text-jig-primary hover:text-red-600 transition-colors">
                  📧 jig@istc.edu
                </a>
                <a href="tel:+22507000000" className="text-jig-primary hover:text-red-600 transition-colors">
                  📞 +225 07 00 00 00
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section informations pratiques */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div data-aos="fade-up" className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Informations pratiques
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Accès */}
            <div data-aos="fade-up" data-aos-delay="100" className="text-center p-6 bg-gray-50 rounded-xl">
              <FaMapMarkerAlt className="text-4xl text-jig-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Lieu & Accès</h3>
              <p className="text-gray-600 mb-3">
                ISTC Polytechnique<br />
                Cité des Arts, Cocody<br />
                Abidjan, Côte d&apos;Ivoire
              </p>
              <p className="text-sm text-gray-500">
                Parking gratuit disponible
              </p>
            </div>
            
            {/* Horaires */}
            <div data-aos="fade-up" data-aos-delay="200" className="text-center p-6 bg-gray-50 rounded-xl">
              <FaClock className="text-4xl text-jig-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Horaires</h3>
              <p className="text-gray-600 mb-3">
                Accueil : 8h00<br />
                Début : 8h30<br />
                Fin : 18h00
              </p>
              <p className="text-sm text-gray-500">
                Pause déjeuner : 12h - 14h
              </p>
            </div>
            
            {/* Inscription */}
            <div data-aos="fade-up" data-aos-delay="300" className="text-center p-6 bg-gray-50 rounded-xl">
              <FaAward className="text-4xl text-jig-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-3">Participation</h3>
              <p className="text-gray-600 mb-3">
                Entrée libre<br />
                Ouvert à tous<br />
                Étudiants et professionnels
              </p>
              <p className="text-sm text-gray-500">
                Certificat de participation
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}