'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectCoverflow } from 'swiper/modules'
import { IoArrowBack, IoChevronBack, IoChevronForward } from 'react-icons/io5'
import AOS from 'aos'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'

export default function GaleriePage() {
  const [isSliderView, setIsSliderView] = useState(false)

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    })
  }, [])

  // Images réelles de la galerie JIG
  const galleryImages = [
    {
      id: 1,
      src: 'un.jpg',
      alt: '',
      title: '',
      year: ''
    },
    {
      id: 2,
      src: 'MasterClasses.jpg',
      alt: '',
      title: '',
      year: ''
    },
    {
      id: 3,
      src: 'trois.jpg',
      alt: '',
      title: '',
      year: ''
    },
    {
      id: 4,
      src: 'Manifestation1.jpg',
      alt: '',
      title: '',
      year: ''
    },
    {
      id: 5,
      src: 'remise de prix.jpg',
      alt: '',
      title: '',
      year: ''
    },
    {
      id: 6,
      src: 'six.jpg',
      alt: '',
      title: '',
      year: ''
    },
    {
      id: 7,
      src: 'setp.jpg',
      alt: '',
      title: '',
      year: ''
    },
    {
      id: 8,
      src: 'huit.jpg',
      alt: '',
      title: '',
      year: ''
    },
    {
      id: 9,
      src: 'dix.jpg',
      alt: '',
      title: '',
      year: ''
    }
  ]

  const getImageUrl = (filename) => {
    return `/galerie/${filename}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Section titre principale avec fond incliné */}
      <section className="relative overflow-hidden bg-gradient-to-br from-jig-primary via-red-600 to-red-700 pt-20">
        
        {/* Effet incliné */}
        <div className="absolute inset-0 bg-gradient-to-br from-jig-primary/90 via-red-600/90 to-red-700/90 transform skew-y-1 origin-top-left"></div>
        
        {/* Motifs décoratifs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center text-white">
          <div data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Galerie JIG
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto leading-relaxed">
              Plongez dans l&apos;univers créatif de la JIG à travers nos plus beaux souvenirs !
            </p>
          </div>

          {/* Boutons pour basculer entre les vues */}
          <div data-aos="fade-up" data-aos-delay="300" className="mt-12">
            <div className="inline-flex bg-white/20 backdrop-blur-sm rounded-full p-1">
              <button
                onClick={() => setIsSliderView(false)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  !isSliderView 
                    ? 'bg-white text-jig-primary shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Vue Grille
              </button>
              <button
                onClick={() => setIsSliderView(true)}
                className={`px-6 py-3 rounded-full transition-all duration-300 ${
                  isSliderView 
                    ? 'bg-white text-jig-primary shadow-lg' 
                    : 'text-white hover:bg-white/10'
                }`}
              >
                Vue Slider
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Galerie - Vue Grille */}
      {!isSliderView && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleryImages.map((image, index) => (
                <div
                  key={image.id}
                  data-aos="zoom-in"
                  data-aos-delay={index * 100}
                  className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:shadow-jig-primary/20"
                >
                  {/* Image réelle avec overlay */}
                  <div className="aspect-square relative overflow-hidden">
                    <Image
                      src={getImageUrl(image.src)}
                      alt={image.alt}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    
                    {/* Overlay hover */}
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-300"></div>
                    
                    {/* Contenu de l&apos;image */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 text-center text-white p-6">
                      <div>
                        <div className="text-sm font-medium mb-2 opacity-80">
                           {image.year}
                        </div>
                        <h3 className="text-lg font-bold leading-tight">
                          {image.title}
                        </h3>
                      </div>
                    </div>
                    
                    {/* Badge année */}
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs font-bold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                      {image.year}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Galerie - Vue Slider */}
      {isSliderView && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div data-aos="fade-up" className="relative">
              <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectCoverflow]}
                spaceBetween={30}
                slidesPerView={1}
                centeredSlides={true}
                autoplay={{
                  delay: 4000,
                  disableOnInteraction: false,
                }}
                pagination={{
                  clickable: true,
                  bulletClass: 'swiper-pagination-bullet !bg-gray-300 !w-3 !h-3',
                  bulletActiveClass: 'swiper-pagination-bullet-active !bg-jig-primary !scale-125',
                }}
                navigation={{
                  prevEl: '.swiper-button-prev-custom',
                  nextEl: '.swiper-button-next-custom',
                }}
                effect="coverflow"
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                className="gallery-swiper pb-16"
              >
                {galleryImages.map((image) => (
                  <SwiperSlide key={image.id}>
                    <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500">
                      
                      {/* Image container */}
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={getImageUrl(image.src)}
                          alt={image.alt}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-all duration-300"></div>
                        
                        {/* Contenu */}
                        <div className="absolute inset-0 flex items-center justify-center z-10 text-center text-white p-8">
                          <div>
                            <div className="text-sm font-medium mb-3 opacity-90 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
                              JIG {image.year}
                            </div>
                            <h3 className="text-xl font-bold leading-tight">
                              {image.title}
                            </h3>
                          </div>
                        </div>

                        {/* Bordure brillante en hover */}
                        <div className="absolute inset-0 border-4 border-transparent group-hover:border-white/30 rounded-2xl transition-all duration-300"></div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Boutons de navigation personnalisés */}
              <button className="swiper-button-prev-custom absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-jig-primary p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                <IoChevronBack className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
              </button>
              
              <button className="swiper-button-next-custom absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white text-jig-primary p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group">
                <IoChevronForward className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Bouton Retour à l&apos;accueil */}
      <section className="py-12 text-center">
        <div data-aos="fade-up">
          <Link 
            href="/"
            className="inline-flex items-center bg-gradient-to-r from-jig-primary to-red-600 text-white font-semibold px-8 py-4 rounded-full hover:from-red-600 hover:to-jig-primary transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
          >
            <IoArrowBack className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour à l&apos;accueil
          </Link>
        </div>
      </section>

      {/* Styles personnalisés pour Swiper */}
      <style jsx global>{`
        .gallery-swiper .swiper-pagination {
          bottom: 0 !important;
        }
        
        .gallery-swiper .swiper-pagination-bullet {
          transition: all 0.3s ease !important;
        }
        
        .gallery-swiper .swiper-slide {
          transition: all 0.5s ease !important;
        }
        
        .gallery-swiper .swiper-slide-active {
          transform: scale(1.05) !important;
          z-index: 2 !important;
        }
      `}</style>
    </div>
  )
}