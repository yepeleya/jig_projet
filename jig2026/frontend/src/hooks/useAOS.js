import { useEffect } from 'react'

const useAOS = () => {
  useEffect(() => {
    // Importer AOS uniquement côté client pour éviter les erreurs SSR
    if (typeof window !== 'undefined') {
      import('aos').then((AOS) => {
        AOS.default.init({
          duration: 800,
          once: true,
          easing: 'ease-out-cubic',
        })
      })
    }
  }, [])
}

// Promise pour charger AOS avec des effets customisés
export const loadAOS = (options = {}) => {
  if (typeof window === 'undefined') return Promise.resolve()
  
  return import('aos').then((AOS) => {
    AOS.default.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
      ...options
    })
    return AOS.default
  })
}

export default useAOS