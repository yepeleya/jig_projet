'use client'

import { useState } from 'react'

export interface UseFilePreviewReturn {
  isPreviewOpen: boolean
  previewFile: string | null
  openPreview: (fileName: string) => void
  closePreview: () => void
}

export function useFilePreview(): UseFilePreviewReturn {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<string | null>(null)

  const openPreview = (fileName: string) => {
    setPreviewFile(fileName)
    setIsPreviewOpen(true)
  }

  const closePreview = () => {
    setIsPreviewOpen(false)
    setPreviewFile(null)
  }

  return {
    isPreviewOpen,
    previewFile,
    openPreview,
    closePreview
  }
}