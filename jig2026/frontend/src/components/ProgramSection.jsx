'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import AOS from 'aos'
import TimelineItem from './TimelineItem'

export default function ProgramSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    })
  }, [])

  // Fonction pour télécharger le programme (génération PDF simulée)
  const downloadProgram = () => {
    // Simulation de téléchargement PDF
    const element = document.createElement('a')
    const file = new Blob([
      `PROGRAMME JIG 2026 - Journée de l'Infographiste\n\n` +
      `08h00 - 09h00 : Accueil et inscription\n` +
      `09h00 - 10h30 : Cérémonie d'ouverture\n` +
      `10h30 - 12h00 : Ateliers créatifs - Session 1\n` +
      `12h00 - 13h30 : Pause déjeuner & Networking\n` +
      `13h30 - 15h00 : Conférences inspirantes\n` +
      `15h00 - 16h30 : Ateliers créatifs - Session 2\n` +
      `16h30 - 17h30 : Concours de créativité\n` +
      `17h30 - 18h30 : Remise des prix & Clôture\n\n` +
      `Pour plus d'informations : contact@jig2026.com`
    ], { type: 'text/plain' })
    
    element.href = URL.createObjectURL(file)
    element.download = 'Programme_JIG_2026.txt'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }



  const programData = [
    {
      time: "08h00 - 09h00",
      title: "Accueil et inscription",
      description: "Arrivée des participants, remise des badges et présentation du programme de la journée. Petit-déjeuner de bienvenue offert."
    },
    {
      time: "09h00 - 10h30",
      title: "Cérémonie d'ouverture",
      description: "Discours inaugural, présentation des invités d'honneur et lancement officiel de la JIG 2026 avec une performance artistique."
    },
    {
      time: "10h30 - 12h00",
      title: "Ateliers créatifs - Session 1",
      description: "Ateliers parallèles : Photographie professionnelle, Design graphique avancé, Animation 2D, et Modélisation 3D."
    },
    {
      time: "12h00 - 13h30",
      title: "Pause déjeuner & Networking",
      description: "Déjeuner convivial et moment d'échange entre participants, étudiants et professionnels du secteur."
    },
    {
      time: "13h30 - 15h00",
      title: "Conférences inspirantes",
      description: "Interventions d'experts du secteur sur les tendances actuelles et futures de l'infographie et du design numérique."
    },
    {
      time: "15h00 - 16h30",
      title: "Ateliers créatifs - Session 2",
      description: "Suite des ateliers avec rotation : Motion design, Illustration numérique, UX/UI Design, et Réalité virtuelle."
    },
    {
      time: "16h30 - 17h30",
      title: "Concours de créativité",
      description: "Challenge créatif en temps réel où les participants doivent créer une œuvre sur un thème imposé en 1 heure."
    },
    {
      time: "17h30 - 18h30",
      title: "Remise des prix & Clôture",
      description: "Annonce des résultats, remise des prix aux gagnants et clôture officielle de la JIG 2026."
    }
  ]

  return (
    <section id="programme" className="py-20 bg-white relative overflow-hidden">
      
      {/* Motifs décoratifs */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-50 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Badge titre centré */}
        <div data-aos="fade-up" className="text-center mb-16">
          <div className="inline-block bg-gradient-to-r from-jig-primary to-red-600 text-white px-8 py-3 rounded-full shadow-lg mb-4">
            <h2 className="text-lg font-semibold">Programme de la journée</h2>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez le programme complet de cette journée exceptionnelle dédiée à l&apos;infographie et à la créativité.
          </p>
        </div>

        {/* Timeline container */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Ligne verticale centrale */}
          <div className="absolute left-1/2 transform -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-jig-primary via-red-400 to-jig-primary"></div>

          {/* Timeline items */}
          <div className="space-y-0">
            {programData.map((item, index) => (
              <TimelineItem
                key={index}
                time={item.time}
                title={item.title}
                description={item.description}
                isLeft={index % 2 === 1}
                delay={index * 100}
              />
            ))}
          </div>

        </div>

        {/* Call to action */}
        <div data-aos="fade-up" data-aos-delay="800" className="text-center mt-16">
          <div className="bg-gray-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Prêt à participer ?
            </h3>
            <p className="text-gray-600 mb-6">
              Inscrivez-vous dès maintenant pour réserver votre place à cette journée extraordinaire.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/soumettre">
                <button className="bg-gradient-to-r from-jig-primary to-red-600 text-white font-semibold px-8 py-3 rounded-full hover:from-red-600 hover:to-jig-primary transition-all duration-300 shadow-lg hover:shadow-xl">
                  Soumettre un projet
                </button>
              </Link>
              <button 
                onClick={downloadProgram}
                className="border-2 border-jig-primary text-jig-primary font-semibold px-8 py-3 rounded-full hover:bg-jig-primary hover:text-white transition-all duration-300"
              >
                Télécharger le programme
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}