'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect } from 'react'
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaFacebook, 
  FaInstagram, 
  FaTiktok, 
  FaLinkedin,
  FaExternalLinkAlt,
  FaPaperPlane,
  FaCheck,
  FaTimes,
  FaExclamationTriangle,
  FaUser,
  FaEdit,
  FaComments
} from 'react-icons/fa'
import useAOS from '../../hooks/useAOS'
import { contactService } from '@/services/api'

interface FormData {
  nom: string
  prenom: string
  email: string
  telephone: string
  sujet: string
  message: string
}

interface Notification {
  show: boolean
  type: 'success' | 'error' | 'warning'
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    sujet: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notification, setNotification] = useState<Notification>({ show: false, type: 'success', message: '' })

  useAOS() // Hook NoSSR pour AOS

  useEffect(() => {
  }, [])

  // Gérer les changements du formulaire
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Afficher une notification
  const showNotification = (type: 'success' | 'error' | 'warning', message: string) => {
    setNotification({ show: true, type, message })
    setTimeout(() => {
      setNotification({ show: false, type: 'success', message: '' })
    }, 5000)
  }

  // Valider le formulaire
  const validateForm = () => {
    if (!formData.nom.trim()) {
      showNotification('error', 'Le nom est requis')
      return false
    }
    if (!formData.prenom.trim()) {
      showNotification('error', 'Le prénom est requis')
      return false
    }
    if (!formData.email.trim()) {
      showNotification('error', 'L\'adresse e-mail est requise')
      return false
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showNotification('error', 'L\'adresse e-mail n\'est pas valide')
      return false
    }
    if (!formData.sujet.trim()) {
      showNotification('error', 'Le sujet est requis')
      return false
    }
    if (!formData.message.trim()) {
      showNotification('error', 'Le message est requis')
      return false
    }
    return true
  }

  // Soumettre le formulaire
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await contactService.sendMessage(formData)
      
      if (response.success) {
        showNotification('success', 'Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.')
        
        // Réinitialiser le formulaire
        setFormData({
          nom: '',
          prenom: '',
          email: '',
          telephone: '',
          sujet: '',
          message: ''
        })
      } else {
        showNotification('error', response.message || 'Erreur lors de l\'envoi du message')
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error)
      showNotification('error', 'Erreur lors de l\'envoi du message. Veuillez réessayer.')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Ouvrir Google Maps
  const openGoogleMaps = () => {
    const address = "ISTC Polytechnique, Cocody, Abidjan, Côte d'Ivoire"
    const encodedAddress = encodeURIComponent(address)
    window.open(`https://maps.google.com/?q=${encodedAddress}`, '_blank')
  }

  // Données de contact
  const contactInfo = [
    {
      icon: FaMapMarkerAlt,
      title: 'Adresse',
      content: 'ISTC Polytechnique, Cocody – Abidjan, Côte d\'Ivoire',
      action: openGoogleMaps,
      actionText: 'Voir sur la carte'
    },
    {
      icon: FaPhone,
      title: 'Téléphone',
      content: '+225 27 22 48 18 00',
      action: () => window.open('tel:+22527224818000'),
      actionText: 'Appeler'
    },
    {
      icon: FaEnvelope,
      title: 'Email',
      content: 'contact@jig2026.ci',
      action: () => window.open('mailto:contact@jig2026.ci'),
      actionText: 'Envoyer un email'
    },
    {
      icon: FaClock,
      title: 'Horaires',
      content: 'Lundi - Vendredi, 8h à 17h',
      action: null,
      actionText: null
    }
  ]

  // Réseaux sociaux
  const socialNetworks = [
    {
      icon: FaFacebook,
      name: 'Facebook',
      url: 'https://facebook.com/jig2026',
      color: 'hover:text-blue-600'
    },
    {
      icon: FaInstagram,
      name: 'Instagram',
      url: 'https://instagram.com/jig2026',
      color: 'hover:text-pink-600'
    },
    {
      icon: FaTiktok,
      name: 'TikTok',
      url: 'https://tiktok.com/@jig2026',
      color: 'hover:text-black'
    },
    {
      icon: FaLinkedin,
      name: 'LinkedIn',
      url: 'https://linkedin.com/company/jig2026',
      color: 'hover:text-blue-700'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 max-w-md transition-all duration-300 ${
          notification.type === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
          notification.type === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
          'bg-yellow-50 border-yellow-500 text-yellow-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {notification.type === 'success' && <FaCheck className="w-5 h-5 mr-3" />}
              {notification.type === 'error' && <FaTimes className="w-5 h-5 mr-3" />}
              {notification.type === 'warning' && <FaExclamationTriangle className="w-5 h-5 mr-3" />}
              <span className="font-medium">{notification.message}</span>
            </div>
            <button 
              onClick={() => setNotification({ show: false, type: 'success', message: '' })}
              className="ml-3 text-gray-400 hover:text-gray-600"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bannière d'introduction */}
      <section className="relative overflow-hidden bg-gradient-to-br from-jig-primary via-red-600 to-red-700 pt-20">
        
        {/* Effet diagonal */}
        <div className="absolute inset-0 bg-gradient-to-br from-jig-primary/90 via-red-600/90 to-red-700/90 transform skew-y-1 origin-top-left"></div>
        
        {/* Motifs décoratifs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-white rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-40 h-40 bg-white rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center text-white">
          <div data-aos="fade-up">
            <div className="mb-6">
              <FaEnvelope className="text-6xl mx-auto mb-4 opacity-80" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl md:text-2xl text-red-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Une question ? Un partenariat ? L&apos;équipe de la JIG vous répond.
            </p>
            <p className="text-lg text-red-200 max-w-2xl mx-auto">
              Besoin d&apos;informations sur la JIG2026 ?<br />
              Écrivez-nous ou passez directement à l&apos;ISTC Polytechnique.
            </p>
          </div>
        </div>

        {/* Effet diagonal blanc en bas */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-current text-gray-50">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </section>

      {/* Section de contact en deux colonnes */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            
            {/* Colonne gauche - Coordonnées */}
            <div data-aos="fade-right">
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                  <FaMapMarkerAlt className="text-jig-primary mr-4" />
                  Nos coordonnées
                </h2>
                
                <div className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon
                    return (
                      <div 
                        key={index}
                        data-aos="fade-up"
                        data-aos-delay={index * 100}
                        className="group"
                      >
                        <div className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-all duration-300">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-jig-primary/10 rounded-lg flex items-center justify-center group-hover:bg-jig-primary group-hover:text-white transition-all duration-300">
                              <Icon className="text-xl text-jig-primary group-hover:text-white" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                              {info.title}
                            </h3>
                            <p className="text-gray-600 leading-relaxed">
                              {info.content}
                            </p>
                            {info.action && (
                              <button
                                onClick={info.action}
                                className="mt-2 text-jig-primary hover:text-red-600 text-sm font-medium flex items-center transition-colors"
                              >
                                {info.actionText}
                                <FaExternalLinkAlt className="w-3 h-3 ml-1" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Colonne droite - Formulaire */}
            <div data-aos="fade-left">
              <div className="bg-white rounded-2xl shadow-lg p-8 h-full">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
                  <FaPaperPlane className="text-jig-primary mr-4" />
                  Envoyez-nous un message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  {/* Nom complet */}
                  <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="inline w-4 h-4 mr-2" />
                      Nom complet *
                    </label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all duration-300"
                      placeholder="Votre nom complet"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      <FaEnvelope className="inline w-4 h-4 mr-2" />
                      Adresse e-mail *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all duration-300"
                      placeholder="votre.email@exemple.com"
                    />
                  </div>

                  {/* Sujet */}
                  <div>
                    <label htmlFor="sujet" className="block text-sm font-medium text-gray-700 mb-2">
                      <FaEdit className="inline w-4 h-4 mr-2" />
                      Sujet *
                    </label>
                    <input
                      type="text"
                      id="sujet"
                      name="sujet"
                      value={formData.sujet}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all duration-300"
                      placeholder="Objet de votre message"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      <FaComments className="inline w-4 h-4 mr-2" />
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-jig-primary focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Votre message détaillé..."
                    />
                  </div>

                  {/* Bouton submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center ${
                      isSubmitting 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-jig-primary to-red-600 hover:from-red-600 hover:to-jig-primary transform hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <FaPaperPlane className="w-5 h-5 mr-3" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Réseaux Sociaux */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Suivez-nous
            </h2>
            <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
              Restez connectés avec la JIG2026 et ne manquez aucune actualité
            </p>
            
            <div className="flex justify-center space-x-8">
              {socialNetworks.map((social, index) => {
                const Icon = social.icon
                return (
                  <div
                    key={index}
                    data-aos="zoom-in"
                    data-aos-delay={index * 100}
                  >
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group flex flex-col items-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${social.color}`}
                    >
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-md">
                        <Icon className="text-2xl text-gray-600 group-hover:text-current" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-current">
                        {social.name}
                      </span>
                    </a>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Section Google Maps intégrée */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div data-aos="fade-up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Notre localisation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Retrouvez-nous à l&apos;ISTC Polytechnique, au cœur de Cocody
            </p>
          </div>
          
          <div data-aos="zoom-in" className="bg-white rounded-2xl shadow-lg p-4">
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3971.8963456789!2d-3.9876543!3d5.3456789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sISTC%20Polytechnique!5e0!3m2!1sfr!2sci!4v1234567890123"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Localisation ISTC Polytechnique"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}