'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import useAOS from '../hooks/useAOS'

export default function GallerySection() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useAOS()

  // Images réelles de la galerie JIG
  const galleryImages = [
    {
      id: 1,
      src: "un.jpg",
      title: "",
      category: "",
      year: " "
    },
    {
      id: 2,
      src: "MasterClasses.jpg",
      title: "",
      category: "",
      year: ""
    },
    {
      id: 3,
      src: "trois.jpg",
      title: "",
      category: "",
      year: ""
    },
    {
      id: 4,
      src: "Manifestation1.jpg",
      title: "",
      category: "",
      year: ""
    },
    {
      id: 5,
      src: "remise de prix.jpg",
      title: "",
      category: "",
      year: ""
    },
    {
      id: 6,
      src: "six.jpg",
      title: "",
      category: "",
      year: ""
    },
    {
      id: 7,
      src: "setp.jpg",
      title: "",
      category: "",
      year: ""
    },
    {
      id: 8,
      src: "huit.jpg",
      title: "",
      category: "",
      year: ""
    },
    {
      id: 9,
      src: "dix.jpg",
      title: "",
      category: "",
      year: ""
    },
    {
      id: 10,
      src: "onze.jpg",
      title: "",
      category: "",
      year: ""
    },
    {
      id: 11,
      src: "douze.jpg",
      title: "",
      category: "",
      year: ""
    },
    {
      id: 12,
      src: "treize.jpg",
      title: "",
      category: "",
      year: ""
    }
  ]

  const getImageUrl = (filename) => {
    return `/galerie/${filename}`
  }

  const totalSlides = Math.ceil(galleryImages.length / 3)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  return (
    <section id="galerie" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Titre rouge centré */}
        <div data-aos="fade-up" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-jig-primary mb-4">
            Galerie des éditions précédentes
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Revivez les moments forts des précédentes éditions de la JIG à travers notre galerie photo.
          </p>
        </div>

        {/* Grille d&apos;images avec slider */}
        <div data-aos="fade-up" data-aos-delay="200" className="relative">
          
          {/* Container du slider */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                    {galleryImages
                      .slice(slideIndex * 3, slideIndex * 3 + 3)
                      .map((image, index) => (
                      <div 
                        key={image.id} 
                        className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
                        data-aos="zoom-in" 
                        data-aos-delay={index * 100}
                      >
                        
                        {/* Image réelle avec overlay */}
                        <div className="aspect-square relative overflow-hidden">
                          <Image
                            src={getImageUrl(image.src)}
                            alt={image.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          
                          {/* Overlay texte */}
                          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                          
                          {/* Contenu centré */}
                          <div className="absolute inset-0 flex items-center justify-center z-10 text-center text-white p-6">
                            <div>
                              <div className="text-sm font-medium mb-2 opacity-80">
                                {image.category} • {image.year}
                              </div>
                              <h3 className="text-lg font-bold leading-tight">
                                {image.title}
                              </h3>
                            </div>
                          </div>
                          
                          {/* Icon camera */}
                          <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                            <div className="w-4 h-4 border-2 border-white rounded"></div>
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Boutons de navigation */}
          {totalSlides > 1 && (
            <>
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-jig-primary p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-jig-primary p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

        </div>

        {/* Points de navigation */}
        {totalSlides > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-jig-primary scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* Bouton "Voir la galerie" centré */}
        <div data-aos="fade-up" data-aos-delay="400" className="text-center mt-12">
          <Link href="/galerie">
            <button className="group bg-gradient-to-r from-jig-primary to-red-600 text-white font-semibold px-8 py-4 rounded-full hover:from-red-600 hover:to-jig-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center mx-auto">
              <span className="mr-2">Voir la galerie complète</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>

      </div>
    </section>
  )
}