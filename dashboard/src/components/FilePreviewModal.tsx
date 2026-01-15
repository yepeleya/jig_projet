'use client'

import Image from 'next/image'
import { FileText, Download, ExternalLink, X } from 'lucide-react'

interface FilePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  fileName: string | null
  fileUrl?: string
  title?: string
}

export default function FilePreviewModal({ 
  isOpen, 
  onClose, 
  fileName, 
  fileUrl,
  title = "Prévisualisation du fichier"
}: FilePreviewModalProps) {
  if (!isOpen || !fileName) return null

  const finalFileUrl = fileUrl || `http://localhost:5000/uploads/${fileName}`
  const extension = fileName.split('.').pop()?.toLowerCase()

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = finalFileUrl
    link.download = fileName
    link.click()
  }

  const handleOpenInNewTab = () => {
    window.open(finalFileUrl, '_blank')
  }

  const renderPreview = () => {
    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return (
        <div className="h-full flex items-center justify-center p-4">
          <Image
            src={finalFileUrl}
            alt="Aperçu du fichier"
            width={800}
            height={600}
            className="max-w-full max-h-full object-contain rounded-lg"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <div className="hidden text-center">
            <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Impossible de charger l&apos;image</p>
          </div>
        </div>
      )
    }

    // Vidéos - utiliser la route proxy pour éviter CORS
    if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(extension || '')) {
      const videoProxyUrl = `/api/video/${encodeURIComponent(fileName)}`
      return (
        <div className="h-full flex items-center justify-center p-4 bg-black">
          <video
            controls
            className="max-w-full max-h-full rounded-lg shadow-lg"
            autoPlay={false}
            preload="metadata"
            style={{ maxHeight: 'calc(100vh - 200px)' }}
            onError={(e) => {
              console.error('Erreur vidéo avec proxy, tentative avec URL directe')
              const video = e.currentTarget
              if (video.src === window.location.origin + videoProxyUrl) {
                video.src = finalFileUrl
              } else {
                video.style.display = 'none'
                const errorDiv = video.nextElementSibling as HTMLElement
                errorDiv?.classList.remove('hidden')
              }
            }}
          >
            <source src={videoProxyUrl} type={`video/${extension}`} />
            <source src={finalFileUrl} type={`video/${extension}`} />
            <p className="text-white text-center p-4">
              Votre navigateur ne supporte pas la lecture vidéo.
              <br />
              <a href={finalFileUrl} className="text-blue-300 underline" target="_blank" rel="noopener noreferrer">
                Télécharger la vidéo
              </a>
            </p>
          </video>
          <div className="hidden text-center">
            <div className="bg-red-100 rounded-lg p-8">
              <svg className="w-24 h-24 text-red-400 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-medium text-red-800 mb-2">Impossible de charger la vidéo</h3>
              <p className="text-red-600 mb-4">Le fichier vidéo ne peut pas être lu dans le navigateur.</p>
              <p className="text-sm text-red-500 mb-4">{fileName}</p>
              <div className="space-x-2">
                <button
                  onClick={handleOpenInNewTab}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto mb-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ouvrir dans un nouvel onglet
                </button>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <Download className="w-4 h-4" />
                  Télécharger la vidéo
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // Documents PDF
    if (extension === 'pdf') {
      return (
        <div className="h-full">
          <iframe
            src={`${finalFileUrl}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full border-0"
            title="Aperçu PDF"
            onError={() => {
              console.error('Erreur lors du chargement du PDF')
            }}
          />
        </div>
      )
    }

    // Documents Office (Word, PowerPoint, etc.)
    if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(extension || '')) {
      return (
        <div className="h-full flex items-center justify-center">
          <div className="text-center">
            <FileText className="w-24 h-24 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">Document Office</h3>
            <p className="text-gray-600 mb-4">
              Les documents Office ne peuvent pas être prévisualisés directement dans le navigateur.
            </p>
            <p className="text-sm text-gray-500 mb-6">{fileName}</p>
            <div className="space-x-2">
              <button
                onClick={handleOpenInNewTab}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto mb-2"
              >
                <ExternalLink className="w-4 h-4" />
                Ouvrir dans un nouvel onglet
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Archives et autres fichiers
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <FileText className="w-24 h-24 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">Aperçu non disponible</h3>
          <p className="text-gray-600 mb-4">
            Ce type de fichier ne peut pas être prévisualisé dans le navigateur.
          </p>
          <p className="text-sm text-gray-500 mb-6">{fileName}</p>
          <div className="space-x-2">
            <button
              onClick={handleOpenInNewTab}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto mb-2"
            >
              <ExternalLink className="w-4 h-4" />
              Ouvrir dans un nouvel onglet
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4">
      <div className="relative w-full h-full max-w-7xl max-h-[95vh] bg-white rounded-xl overflow-hidden shadow-2xl">
        {/* Header du modal */}
        <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-10 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{fileName}</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleOpenInNewTab}
                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Nouvel onglet
              </button>
              <button
                onClick={handleDownload}
                className="px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenu de la prévisualisation */}
        <div className="pt-20 h-full">
          {renderPreview()}
        </div>
      </div>
    </div>
  )
}