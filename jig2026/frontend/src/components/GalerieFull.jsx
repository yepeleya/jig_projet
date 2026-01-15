'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { X, ZoomIn, Calendar, Users, Award, MapPin } from 'lucide-react'

// Liste complète des images de la galerie JIG
const galerieImages = [
  // Images numérotées
  'un.jpg', 'deux.jpg', 'trois.jpg', 'quatres.jpg', 'cinq.jpg', 'six.jpg',
  'setp.jpg', 'huit.jpg', 'dix.jpg', 'onze.jpg', 'douze.jpg', 'treize.jpg',
  'quatorze.jpg', 'quinze.jpg', 'seize.jpg', 'dix-sept.jpg', 'dix-huit.jpg',
  'dix-neuf.jpg', 'vingt.jpg', 'vingt-et-un.jpg', 'vingt-deux.jpg', 'vingt-trois.jpg',
  'vingt-quatre.jpg', 'vingt-cinq.jpg', 'vingt-six.jpg', 'vingt-sept.jpg',
  'vingt-huit.jpg', 'vingt-neuf.jpg', 'trente.jpg',
  
  // Images d'événements
  'Manifestation1.jpg', 'Manifestation 2.jpg', 'Manifestation3.jpg',
  'MasterClasses.jpg', 'MasterClasses1.jpg', 'MasterClasses2.jpg',
  'vrai master.jpg', 'vrai master 1.jpg', 'vrai master 2.jpg',
  'remise de prix.jpg', 'remise de prix 1.jpg', 'remise de prix 2.jpg',
  
  // Images supplémentaires
  'IMG-20230224-WA0045.jpg', 'IMG-20230224-WA0057.jpg', 'IMG-20230224-WA0058.jpg',
  'IMG-20230224-WA0083.jpg', 'IMG-20230224-WA0088.jpg', 'IMG-20230224-WA0104.jpg',
  'IMG-20230224-WA0142.jpg', 'IMG-20230224-WA0145.jpg', 'IMG-20230224-WA0149.jpg',
  'IMG-20230224-WA0154.jpg', 'IMG-20230224-WA0160.jpg', 'IMG-20230224-WA0168.jpg',
  'IMG-20230224-WA0173.jpg', 'IMG-20230224-WA0220.jpg', 'IMG-20230224-WA0224.jpg',
  'IMG-20230224-WA0234.jpg'
]

// Catégories d'images
const categories = {
  'all': { name: 'Toutes', images: galerieImages },
  'manifestations': { 
    name: 'Manifestations', 
    images: galerieImages.filter(img => img.includes('Manifestation') || img.includes('IMG-20230224'))
  },
  'masterclasses': { 
    name: 'Master Classes', 
    images: galerieImages.filter(img => img.includes('master') || img.includes('MasterClasses'))
  },
  'remises': { 
    name: 'Remises de Prix', 
    images: galerieImages.filter(img => img.includes('remise de prix'))
  }
}

export default function GalerieFull({ 
  images = galerieImages, 
  maxImages, 
  className = '', 
  showCategories = true,
  showStats = true,
  title = "Galerie JIG 2026"
}) {
  const [selectedImage, setSelectedImage] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  
  const visibleImages = useMemo(() => {
    const categoryImages = categories[activeCategory]?.images || images
    return maxImages ? categoryImages.slice(0, maxImages) : categoryImages
  }, [activeCategory, images, maxImages])

  const getImageUrl = (filename) => {
    return `/galerie/${filename}`
  }

  const getImageTitle = (filename) => {
    if (filename.includes('Manifestation')) return 'Événement de manifestation'
    if (filename.includes('master')) return 'Session Master Class'
    if (filename.includes('remise de prix')) return 'Cérémonie de remise des prix'
    return 'Moments JIG 2026'
  }

  return (
    <div className={`${className}`}>
      {/* En-tête avec titre */}
      {title && (
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#333333] mb-4">
            {title}
          </h2>
          <div className="w-24 h-1 bg-[#9E1B32] mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez les moments forts de la Journée de l&apos;Infographiste à travers notre galerie photo.
          </p>
        </div>
      )}

      {/* Statistiques */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="bg-[#9E1B32] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">3</div>
            <div className="text-sm text-gray-600">Jours d&apos;événement</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="bg-[#9E1B32] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">500+</div>
            <div className="text-sm text-gray-600">Participants</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="bg-[#9E1B32] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <Award className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">25</div>
            <div className="text-sm text-gray-600">Prix remis</div>
          </div>
          <div className="text-center p-4 bg-white rounded-lg shadow-sm">
            <div className="bg-[#9E1B32] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="text-2xl font-bold text-gray-900">CI</div>
            <div className="text-sm text-gray-600">Côte d&apos;Ivoire</div>
          </div>
        </div>
      )}

      {/* Filtres par catégories */}
      {showCategories && (
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setActiveCategory(key)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === key
                  ? 'bg-[#9E1B32] text-white shadow-lg transform scale-105'
                  : 'bg-white text-[#333333] border border-gray-200 hover:border-[#9E1B32] hover:text-[#9E1B32]'
              }`}
            >
              {category.name}
              <span className="ml-2 text-xs opacity-75">
                ({category.images.length})
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Grille d'images */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleImages.map((image, index) => (
          <div
            key={index}
            className="relative aspect-square overflow-hidden rounded-xl cursor-pointer group bg-white shadow-sm hover:shadow-xl transition-all duration-300"
            onClick={() => setSelectedImage(image)}
          >
            <Image
              src={getImageUrl(image)}
              alt={getImageTitle(image)}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            
            {/* Overlay avec icône zoom */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300" />
            </div>
            
            {/* Badge catégorie */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-[#9E1B32] text-white text-xs px-2 py-1 rounded-full">
                {getImageTitle(image)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Message si aucune image */}
      {visibleImages.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">Aucune image dans cette catégorie</div>
        </div>
      )}

      {/* Modal pour afficher l'image en grand */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-95">
          <div className="relative max-w-7xl max-h-[95vh] w-full h-full flex items-center justify-center p-4">
            {/* Bouton fermer */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-3 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white hover:bg-opacity-30 transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
            
            {/* Image agrandie */}
            <div className="relative max-w-full max-h-full">
              <Image
                src={getImageUrl(selectedImage)}
                alt={getImageTitle(selectedImage)}
                width={1200}
                height={800}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
              
              {/* Titre de l'image */}
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-white text-lg font-semibold mb-1">
                  {getImageTitle(selectedImage)}
                </h3>
                <p className="text-gray-300 text-sm">
                  JIG 2026 - Journée de l&apos;Infographiste
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}