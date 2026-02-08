'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import AOS from 'aos'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function AboutSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Images pour le carrousel de la JIG
  const jigImages = [
    {
      src: "/galerie/MasterClasses.jpg",
      title: "Master Classes",
      description: "Sessions de formation avec experts"
    },
    {
      src: "/galerie/Manifestation1.jpg", 
      title: "Manifestation JIG",
      description: "Événement principal de la journée"
    },
    {
      src: "/galerie/remise de prix.jpg",
      title: "Remise des Prix",
      description: "Cérémonie de récompenses"
    },
    {
      src: "/galerie/vrai master.jpg",
      title: "Ateliers Pratiques",
      description: "Formation hands-on"
    },
    {
      src: "/galerie/trois.jpg",
      title: "Projets Étudiants",
      description: "Exposition des créations"
    },
    {
      src: "/galerie/six.jpg",
      title: "Networking",
      description: "Échanges entre participants"
    }
  ]

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    })
  }, [])

  // Navigation du carrousel
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % jigImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + jigImages.length) % jigImages.length)
  }

  // Auto-play du carrousel
  useEffect(() => {
    const interval = setInterval(nextImage, 4000) // Change toutes les 4 secondes
    return () => clearInterval(interval)
  }, [])

  // Fonction pour scroll vers le programme
  const scrollToProgram = () => {
    const element = document.getElementById('programme')
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  return (
    <section id="apropos" className="py-20 bg-gray-50 relative overflow-hidden">
      
      {/* Illustration décorative en arrière-plan */}
      <div className="absolute top-10 right-10 opacity-5">
        <div className="w-96 h-96 text-jig-primary">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Plume stylisée */}
            <path d="M20 80 Q30 20, 50 10 Q70 20, 80 80 Q70 70, 50 75 Q30 70, 20 80 Z" fill="currentColor"/>
            <path d="M45 15 L55 15 M40 25 L60 25 M35 35 L65 35 M30 45 L70 45" stroke="currentColor" strokeWidth="1" fill="none"/>
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Badge titre */}
        <div data-aos="fade-up" className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-jig-primary to-red-600 text-white px-8 py-3 rounded-full shadow-lg">
            <h2 className="text-lg font-semibold">À propos de la JIG</h2>
          </div>
        </div>

        {/* Contenu en deux colonnes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Colonne de texte */}
          <div data-aos="fade-right" className="space-y-6">
            <p className="text-lg text-gray-700 leading-relaxed">
              La <strong className="text-jig-primary">Journée de l'Infographiste (JIG)</strong> est un événement annuel 
              qui célèbre la créativité et l'innovation dans le domaine de l'infographie et du design numérique. 
              Organisée par l'ISTC Polytechnique, cette journée unique rassemble étudiants, professionnels et passionnés 
              autour de leur amour commun pour l'art visuel et la technologie.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed">
              Au programme : <strong className="text-jig-primary">expositions de projets étudiants</strong>, 
              ateliers pratiques, conférences inspirantes, et concours de créativité. C'est l'occasion parfaite 
              de découvrir les dernières tendances en photographie, PAO, animation 2D/3D, et bien plus encore. 
              Que vous soyez débutant ou expert, la JIG 2026 vous promet une expérience enrichissante et mémorable.
            </p>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-jig-primary mb-2">500+</div>
                <div className="text-sm text-gray-600">Participants</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-jig-primary mb-2">100+</div>
                <div className="text-sm text-gray-600">Projets exposés</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-jig-primary mb-2">12h</div>
                <div className="text-sm text-gray-600">D'activités</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-jig-primary mb-2">8</div>
                <div className="text-sm text-gray-600">Ateliers</div>
              </div>
            </div>
          </div>

          {/* Colonne visuelle - Carrousel d'images */}
          <div data-aos="fade-left" data-aos-delay="200" className="relative">
            
            {/* Carrousel d'images */}
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-4 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-square relative rounded-xl overflow-hidden">
                {/* Image actuelle */}
                <Image
                  src={jigImages[currentImageIndex].src}
                  alt={jigImages[currentImageIndex].title}
                  fill
                  className="object-cover transition-all duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Overlay avec titre et animation */}
                <div className="absolute inset-0 bg-gradient-to-br from-jig-primary/80 to-red-400/80 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-6xl font-black mb-4">JIG</div>
                    <div className="text-xl font-light">2026</div>
                    <div className="w-16 h-px bg-white mx-auto mt-4 mb-2"></div>
                    <div className="text-sm opacity-90">{jigImages[currentImageIndex].title}</div>
                    <div className="text-xs opacity-80 mt-1">{jigImages[currentImageIndex].description}</div>
                  </div>
                </div>

                {/* Boutons de navigation */}
                <button 
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all duration-200"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                
                <button 
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 rounded-full p-2 transition-all duration-200"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>

                {/* Indicateurs */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                  {jigImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentImageIndex 
                          ? 'bg-white scale-125' 
                          : 'bg-white/50 hover:bg-white/80'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Éléments décoratifs */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-400 rounded-full opacity-15 animate-pulse" style={{ animationDelay: '1s' }}></div>
            
            {/* Points flottants */}
            <div className="absolute top-1/4 -left-2 w-3 h-3 bg-jig-primary rounded-full animate-bounce"></div>
            <div className="absolute bottom-1/4 -right-2 w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          </div>

        </div>

        {/* Call to action */}
        <div data-aos="fade-up" data-aos-delay="400" className="text-center mt-16">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={scrollToProgram}
              className="bg-gradient-to-r from-jig-primary to-red-600 text-white font-semibold px-8 py-4 rounded-full hover:from-red-600 hover:to-jig-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Voir le programme complet
            </button>
            
            <Link href="/galerie">
              <button className="border-2 border-jig-primary text-jig-primary font-semibold px-8 py-4 rounded-full hover:bg-jig-primary hover:text-white transition-all duration-300 shadow-lg">
                Découvrir la galerie
              </button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  )
}