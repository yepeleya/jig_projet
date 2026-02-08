'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import AOS from 'aos'

const intervenants = [
  {
    id: 1,
    nom: "Chafick Adibade",
    titre: "Enseignant",
    panel: "Panel 1",
    description: "Expert en pédagogie et formation en arts numériques",
    photo: "/intervenant/Chafick adibade.jpeg"
  },
  {
    id: 2,
    nom: "Bourama Junior",
    titre: "Directeur artistique",
    panel: "Panel 1",
    description: "Spécialiste en direction artistique et design visuel",
    photo: "/intervenant/Bourama junior.jpeg"
  },
  {
    id: 3,
    nom: "Hamdan Nasser",
    titre: "Directeur artistique",
    panel: "Panel 1",
    description: "Expert en création graphique et stratégie visuelle",
    photo: "/intervenant/Hamdan Nasser.jpeg"
  },
  {
    id: 4,
    nom: "Adja Soro",
    titre: "Fondatrice de l'agence Kä",
    panel: "Panel 1",
    description: "Entrepreneure dans l'industrie créative",
    photo: "/intervenant/Adja Soro.jpeg"
  },
  {
    id: 5,
    nom: "Maître Arthur Atta",
    titre: "Psychologue",
    panel: "Panel 2",
    description: "Spécialiste en santé mentale et bien-être au travail",
    photo: "/intervenant/Maître Arthur Atta.jpeg"
  },
  {
    id: 6,
    nom: "Somey Amegnibo",
    titre: "Professeur de design",
    panel: "Panel 2",
    description: "Expert en pédagogie du design et méthodologie créative",
    photo: "/intervenant/Somey Amegnibo.jpeg"
  },
  {
    id: 7,
    nom: "Nandy",
    titre: "Intervenant",
    panel: "Panel 2",
    description: "Professionnel de l'industrie créative",
    photo: "/intervenant/Nandy.jpeg"
  }
]

export default function IntervenantsSection() {
  const [selectedPanel, setSelectedPanel] = useState('Panel 1')

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  const filteredIntervenants = intervenants.filter(intervenant => intervenant.panel === selectedPanel)

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Titre de section */}
        <div data-aos="fade-up" className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-jig-primary to-red-600 text-white px-8 py-3 rounded-full shadow-lg mb-4">
            <h2 className="text-lg font-semibold">Nos Intervenants</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les experts qui partageront leur expérience lors des panels de discussion.
          </p>
        </div>

        {/* Sélecteur de panels */}
        <div data-aos="fade-up" data-aos-delay="100" className="flex justify-center mb-12">
          <div className="bg-white rounded-full p-2 shadow-lg border">
            <button
              onClick={() => setSelectedPanel('Panel 1')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedPanel === 'Panel 1'
                  ? 'bg-gradient-to-r from-jig-primary to-red-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-jig-primary'
              }`}
            >
              Panel 1 - Se démarquer
            </button>
            <button
              onClick={() => setSelectedPanel('Panel 2')}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedPanel === 'Panel 2'
                  ? 'bg-gradient-to-r from-jig-primary to-red-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-jig-primary'
              }`}
            >
              Panel 2 - Santé mentale
            </button>
          </div>
        </div>

        {/* Titre du panel sélectionné */}
        <div data-aos="fade-up" data-aos-delay="200" className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {selectedPanel === 'Panel 1' 
              ? "Se démarquer dans le monde créatif : survivre et réussir dans l'infographie aujourd'hui"
              : "Créer sans s'épuiser : la santé mentale dans les métiers créatifs"
            }
          </h3>
        </div>

        {/* Grille des intervenants */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredIntervenants.map((intervenant, index) => (
            <div 
              key={intervenant.id}
              data-aos="fade-up"
              data-aos-delay={300 + (index * 100)}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Photo */}
              <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-md">
                <Image
                  src={intervenant.photo}
                  alt={intervenant.nom}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 128px, 128px"
                />
              </div>
              
              {/* Informations */}
              <div className="text-center">
                <h4 className="text-lg font-bold text-gray-800 mb-1">{intervenant.nom}</h4>
                <p className="text-jig-primary font-medium mb-2">{intervenant.titre}</p>
                <p className="text-sm text-gray-600">{intervenant.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}