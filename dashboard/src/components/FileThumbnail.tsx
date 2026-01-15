'use client'

import Image from 'next/image'
import { FileText, Eye } from 'lucide-react'

interface FileThumbnailProps {
  fileName: string | null
  className?: string
  showPreviewButton?: boolean
  onPreview?: () => void
}

export default function FileThumbnail({ 
  fileName, 
  className = "w-16 h-16",
  showPreviewButton = false,
  onPreview
}: FileThumbnailProps) {
  if (!fileName) {
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200`}>
        <span className="text-gray-400 text-xs">Aucun</span>
      </div>
    )
  }

  const fileUrl = `http://localhost:5000/uploads/${fileName}`
  const extension = fileName.split('.').pop()?.toLowerCase()

  const renderThumbnail = () => {
    // Images
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return (
        <div className={`${className} relative group`}>
          <Image 
            src={fileUrl} 
            alt="Aperçu" 
            width={64}
            height={64}
            className={`${className} object-cover rounded-lg border border-gray-200`}
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              if (e.currentTarget.nextElementSibling) {
                (e.currentTarget.nextElementSibling as HTMLElement).classList.remove('hidden')
              }
            }}
          />
          <div className={`hidden ${className} bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200`}>
            <FileText className="w-6 h-6 text-gray-600" />
          </div>
          {showPreviewButton && onPreview && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all duration-200">
              <button
                onClick={onPreview}
                className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-1 shadow-lg transition-all duration-200 hover:scale-110"
                title="Prévisualiser"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          )}
        </div>
      )
    }

    // Vidéos
    if (['mp4', 'webm', 'ogg', 'avi', 'mov'].includes(extension || '')) {
      return (
        <div className={`${className} bg-purple-100 rounded-lg flex items-center justify-center border border-purple-200 relative group`}>
          <span className="text-purple-600 text-xs font-medium">VID</span>
          {showPreviewButton && onPreview && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all duration-200">
              <button
                onClick={onPreview}
                className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-1 shadow-lg transition-all duration-200 hover:scale-110"
                title="Prévisualiser"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          )}
        </div>
      )
    }

    // PDF
    if (extension === 'pdf') {
      return (
        <div className={`${className} bg-red-100 rounded-lg flex items-center justify-center border border-red-200 relative group`}>
          <span className="text-red-600 text-xs font-medium">PDF</span>
          {showPreviewButton && onPreview && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all duration-200">
              <button
                onClick={onPreview}
                className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-1 shadow-lg transition-all duration-200 hover:scale-110"
                title="Prévisualiser"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          )}
        </div>
      )
    }

    // Documents Office
    if (['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(extension || '')) {
      const colors = {
        doc: 'bg-blue-100 border-blue-200 text-blue-600',
        docx: 'bg-blue-100 border-blue-200 text-blue-600',
        ppt: 'bg-orange-100 border-orange-200 text-orange-600',
        pptx: 'bg-orange-100 border-orange-200 text-orange-600',
        xls: 'bg-green-100 border-green-200 text-green-600',
        xlsx: 'bg-green-100 border-green-200 text-green-600'
      }
      const colorClass = colors[extension as keyof typeof colors] || 'bg-gray-100 border-gray-200 text-gray-600'
      
      return (
        <div className={`${className} ${colorClass} rounded-lg flex items-center justify-center border relative group`}>
          <span className="text-xs font-medium uppercase">{extension}</span>
          {showPreviewButton && onPreview && (
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all duration-200">
              <button
                onClick={onPreview}
                className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-1 shadow-lg transition-all duration-200 hover:scale-110"
                title="Prévisualiser"
              >
                <Eye className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          )}
        </div>
      )
    }

    // Autres fichiers
    return (
      <div className={`${className} bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200 relative group`}>
        <FileText className="w-6 h-6 text-gray-600" />
        {showPreviewButton && onPreview && (
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-lg flex items-center justify-center transition-all duration-200">
            <button
              onClick={onPreview}
              className="opacity-0 group-hover:opacity-100 bg-white rounded-full p-1 shadow-lg transition-all duration-200 hover:scale-110"
              title="Prévisualiser"
            >
              <Eye className="w-4 h-4 text-gray-700" />
            </button>
          </div>
        )}
      </div>
    )
  }

  return renderThumbnail()
}