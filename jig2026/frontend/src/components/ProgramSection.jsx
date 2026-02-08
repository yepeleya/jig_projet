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
      `PROGRAMME JIG 2026 - Journée Innovation et Génie Étudiant\n\n` +
      `08h00 - 09h30 : Accueil et installation des invités\n` +
      `09h30 - 09h35 : Allocution du PCO de la Journée\n` +
      `09h35 - 09h40 : Allocution du Directeur de l'EAIN (M. TA BI Gbamble)\n` +
      `09h40 - 09h45 : Présentation des travaux des étudiants de l'EAIN\n` +
      `09h45 - 10h05 : Remise de diplôme à la présidente sortante\n` +
      `10h05 - 10h35 : Panel 1 : Se démarquer dans le monde créatif\n` +
      `10h35 - 10h40 : Slam\n` +
      `10h40 - 11h10 : Panel 2 : Créer sans s'épuiser\n` +
      `11h10 - 11h15 : 5 minutes pour se vendre\n` +
      `11h15 - 11h30 : Parcours inspirant\n` +
      `11h30 - 11h40 : Allocution du parrain\n` +
      `11h40 - 12h00 : Masterclass\n\n` +
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
      time: "08h00 - 09h30",
      title: "Accueil et installation des invités",
      description: "Accueil des participants, invités et étudiants avec installation dans l'amphithéâtre."
    },
    {
      time: "09h30 - 09h35",
      title: "Allocution du PCO de la Journée",
      description: "Mot d'ouverture et présentation du programme par le Président du Comité d'Organisation."
    },
    {
      time: "09h35 - 09h40",
      title: "Allocution du Directeur de l'EAIN",
      description: "Message d'accueil et de bienvenue par M. TA BI Gbamble, Directeur de l'École des Arts et Images Numériques."
    },
    {
      time: "09h40 - 09h45",
      title: "Présentation des travaux des étudiants de l'EAIN",
      description: "Mise en lumière des projets et réalisations des étudiants en Arts et Images Numériques."
    },
    {
      time: "09h45 - 10h05",
      title: "Remise de diplôme à la présidente sortante",
      description: "Cérémonie officielle de remise de diplôme et reconnaissance des services rendus."
    },
    {
      time: "10h05 - 10h35",
      title: "Panel 1 : Se démarquer dans le monde créatif",
      description: "Se démarquer dans le monde créatifs : survivre et réussir dans l'infographie aujourd'hui. Intervenants : Chafick Adibade (Enseignant), Bourama Junior (Directeur artistique), Hamdan Nasser (Directeur artistique), Adja Soro (Fondatrice de l'agence Kä)"
    },
    {
      time: "10h35 - 10h40",
      title: "Slam",
      description: "Performance artistique de slam poetry par des étudiants talentueux."
    },
    {
      time: "10h40 - 11h10",
      title: "Panel 2 : Créer sans s'épuiser",
      description: "Créer sans s'épuiser : la santé mentale dans les métiers créatifs. Intervenants : Maître Arthur Atta (Psychologue), Somey Amegnibo (Professeur de design), Nandy"
    },
    {
      time: "11h10 - 11h15",
      title: "5 minutes pour se vendre",
      description: "Session de pitch rapide où les étudiants présentent leurs compétences et projets."
    },
    {
      time: "11h15 - 11h30",
      title: "Parcours inspirant",
      description: "Témoignage d'un professionnel sur son parcours dans l'industrie créative."
    },
    {
      time: "11h30 - 11h40",
      title: "Allocution du parrain",
      description: "Message et conseils du parrain de la promotion aux futurs diplômés."
    },
    {
      time: "11h40 - 12h00",
      title: "Masterclass",
      description: "Atelier technique animé par un expert de l'industrie des arts numériques."
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
            Découvrez le programme complet de cette journée exceptionnelle dédiée à l'innovation et au génie étudiant.
          </p>
          <div className="mt-4">
            <p className="text-sm text-gray-500">Contact : <a href="mailto:jigeain@gmail.com" className="text-jig-primary hover:underline">jigeain@gmail.com</a></p>
            <p className="text-sm text-gray-500">Instagram : <a href="https://instagram.com/_jig_2025" target="_blank" rel="noopener noreferrer" className="text-jig-primary hover:underline">@_jig_2025</a></p>
          </div>
        </div>

        {/* Timeline container */}
        <div className="relative max-w-4xl mx-auto">
          
          {/* Ligne verticale centrale - cachée sur mobile */}
          <div className="absolute left-1/2 transform -translate-x-px top-0 bottom-0 w-0.5 bg-gradient-to-b from-jig-primary via-red-400 to-jig-primary hidden md:block"></div>

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