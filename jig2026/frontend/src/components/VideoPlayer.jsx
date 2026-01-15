'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX, Maximize, AlertTriangle } from 'lucide-react'
import { NetworkErrorHandler } from '../utils/networkErrorHandler.js'

export default function VideoPlayer({ 
  src, 
  fallbackSrc = null,
  poster,
  className = '',
  controls = true,
  autoPlay = false,
  muted = false,
  loop = false,
  onError,
  onLoad
}) {
  const videoRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(muted)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  const maxRetries = 3

  useEffect(() => {
    if (videoRef.current && src) {
      loadVideo()
    }
  }, [src])

  const loadVideo = async () => {
    if (!videoRef.current) return

    setIsLoading(true)
    setError(null)

    try {
      // Utiliser le gestionnaire d'erreur réseau pour les médias
      await NetworkErrorHandler.loadMediaWithFallback(
        videoRef.current,
        src,
        fallbackSrc
      )
      
      setIsLoading(false)
      onLoad?.()
    } catch (err) {
      console.error('Erreur chargement vidéo:', err)
      setError(err.message)
      setIsLoading(false)
      onError?.(err)
    }
  }

  const togglePlay = () => {
    if (!videoRef.current) return

    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play().catch(err => {
        console.error('Erreur lecture vidéo:', err)
        setError('Impossible de lire la vidéo')
      })
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (!videoRef.current) return

    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen()
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen()
    }
  }

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1)
      loadVideo()
    }
  }

  const handleVideoEvents = {
    onPlay: () => setIsPlaying(true),
    onPause: () => setIsPlaying(false),
    onLoadStart: () => setIsLoading(true),
    onLoadedData: () => setIsLoading(false),
    onError: (e) => {
      const videoError = e.target.error
      let errorMessage = 'Erreur de lecture vidéo'
      
      if (videoError) {
        switch (videoError.code) {
          case videoError.MEDIA_ERR_ABORTED:
            errorMessage = 'Lecture interrompue'
            break
          case videoError.MEDIA_ERR_NETWORK:
            errorMessage = 'Erreur réseau lors du chargement'
            break
          case videoError.MEDIA_ERR_DECODE:
            errorMessage = 'Erreur de décodage vidéo'
            break
          case videoError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = 'Format vidéo non supporté'
            break
          default:
            errorMessage = 'Erreur inconnue'
        }
      }
      
      setError(errorMessage)
      setIsLoading(false)
      onError?.(new Error(errorMessage))
    }
  }

  if (error) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-8 ${className}`}>
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-600 text-center mb-2">Impossible de charger la vidéo</p>
        <p className="text-gray-500 text-sm text-center mb-4">{error}</p>
        {retryCount < maxRetries && (
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-jig-primary text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Réessayer ({retryCount + 1}/{maxRetries})
          </button>
        )}
      </div>
    )
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      <video
        ref={videoRef}
        poster={poster}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        className="w-full h-full object-contain"
        {...handleVideoEvents}
      >
        Votre navigateur ne supporte pas la lecture vidéo.
      </video>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
        </div>
      )}

      {/* Custom controls */}
      {controls && !isLoading && !error && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={togglePlay}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
              
              <button
                onClick={toggleMute}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
            </div>

            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}