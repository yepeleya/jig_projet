'use client'

import { Clock } from 'lucide-react'

export default function TimelineItem({ time, title, description, isLeft = false, delay = 0 }) {
  return (
    <div 
      className={`flex items-center mb-8 ${isLeft ? 'flex-row-reverse' : ''}`}
      data-aos={isLeft ? "fade-left" : "fade-right"}
      data-aos-delay={delay}
    >
      
      {/* Carte contenu */}
      <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 w-80 ${
        isLeft ? 'mr-8 ml-4' : 'ml-8 mr-4'
      } group hover:-translate-y-1`}>
        
        {/* Heure */}
        <div className="flex items-center mb-3">
          <Clock className="w-4 h-4 text-jig-primary mr-2" />
          <span className="text-sm font-semibold text-jig-primary bg-red-50 px-3 py-1 rounded-full">
            {time}
          </span>
        </div>

        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-jig-primary transition-colors">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed">
          {description}
        </p>

        {/* Flèche pointant vers la timeline */}
        <div className={`absolute top-8 ${
          isLeft 
            ? '-right-2 border-l-8 border-l-white border-t-8 border-t-transparent border-b-8 border-b-transparent' 
            : '-left-2 border-r-8 border-r-white border-t-8 border-t-transparent border-b-8 border-b-transparent'
        } w-0 h-0`}></div>
      </div>

      {/* Point sur la ligne */}
      <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-jig-primary to-red-600 rounded-full border-4 border-white shadow-lg z-10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-jig-primary to-red-600 rounded-full animate-ping opacity-75"></div>
      </div>

    </div>
  )
}