'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useJuryStore } from '@/store/juryStore'
import { juryApi } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, LogIn, Mail, Lock, Award, Trophy, Zap } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { JIG_CLASSES } from '@/lib/design-system'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const setJury = useJuryStore((state) => state.setJury)

  const loginMutation = useMutation({
    mutationFn: ({ email, motDePasse }: { email: string; motDePasse: string }) =>
      juryApi.login(email, motDePasse),
    onSuccess: (data) => {
      if (data?.user?.role && (data.user.role === 'JURY' || data.user.role === 'ADMIN')) {
        setJury(data.user, data.token)
        toast.success(`Bienvenue ${data.user.prenom} ${data.user.nom}`)
        router.push('/dashboard')
      } else {
        toast.error('Accès réservé aux membres du jury')
      }
    },
    onError: (error: unknown) => {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion'
      toast.error(errorMessage)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !motDePasse) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    loginMutation.mutate({ email, motDePasse })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo et en-tête */}
          <div className="text-center mb-8">
            <Logo size="xl" className="justify-center mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Interface Jury
            </h1>
            <p className="text-gray-600">
              JIG 2026 - Plateforme d&apos;évaluation
            </p>
          </div>

          {/* Formulaire de connexion */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9E1B32] focus:border-transparent transition-colors"
                    placeholder="votre.email@exemple.fr"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#9E1B32] focus:border-transparent transition-colors"
                    placeholder="Votre mot de passe"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginMutation.isPending}
                className={`w-full ${JIG_CLASSES.btnPrimary} py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9E1B32] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2`}
              >
                {loginMutation.isPending ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Se connecter</span>
                  </>
                )}
              </button>
            </form>

            {/* Aide */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Problème de connexion ? Contactez l&apos;administrateur
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Visual Content */}
      <div className="hidden lg:flex lg:flex-1 bg-linear-to-br from-[#9E1B32] via-[#7A1528] to-[#5D0F1F] p-12 flex-col justify-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-10 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-8">
            <Logo size="lg" variant="white" className="mr-4" />
            <div>
              <h2 className="text-4xl font-bold text-white mb-2">JIG 2026</h2>
              <p className="text-white/90">Interface Jury</p>
            </div>
          </div>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Évaluez les projets innovants de JIG 2026 et participez à la sélection des meilleurs talents de demain.
          </p>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Évaluation de projets</h3>
                <p className="text-white/80">Notez et commentez les projets soumis</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Suivi des résultats</h3>
                <p className="text-white/80">Consultez vos évaluations et statistiques</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Interface moderne</h3>
                <p className="text-white/80">Expérience utilisateur optimisée</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-white">2026</div>
                <div className="text-white/80 text-sm">Édition JIG</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">100+</div>
                <div className="text-white/80 text-sm">Projets innovants</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">24h</div>
                <div className="text-white/80 text-sm">Disponible</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}