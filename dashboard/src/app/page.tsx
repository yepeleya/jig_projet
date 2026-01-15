'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { useAdminStore } from '@/store/adminStore'
import { adminApi } from '@/lib/api'
import { toast } from 'react-hot-toast'
import { Eye, EyeOff, LogIn, Shield, BarChart3, Users, Settings, Award, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatFullName } from '@/utils/formatters'
import Logo from '@/components/Logo'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const setAdmin = useAdminStore((state) => state.setAdmin)

  const loginMutation = useMutation({
    mutationFn: ({ email, motDePasse }: { email: string; motDePasse: string }) =>
      adminApi.login(email, motDePasse),
    onSuccess: (data) => {
      if (data.user.role === 'ADMIN') {
        setAdmin(data.user, data.token)
        toast.success(`Bienvenue ${formatFullName(data.user.prenom, data.user.nom)}`)
        router.push('/admin/dashboard')
      } else {
        toast.error('Accès réservé aux administrateurs')
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
      
      {/* Section gauche - Informations JIG 2026 */}
      <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-red-600 via-red-700 to-red-800 p-12 flex-col justify-center relative overflow-hidden"
      >
        {/* Motifs de fond */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-white rounded-full"></div>
        </div>

        <div className="relative z-10 text-white">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center mb-6">
              <Logo variant="white" size="sm" className="mr-4" />
              <div>
                <h1 className="text-4xl font-bold">JIG 2026</h1>
                <p className="text-red-200">Dashboard Administrateur</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-light leading-tight">
              Gérez votre concours d&apos;innovation avec
              <span className="font-bold"> excellence</span>
            </h2>
            
            <p className="text-red-100 text-lg leading-relaxed">
              Accédez à tous les outils administratifs pour superviser les participants, 
              valider les projets, et analyser les résultats du concours JIG 2026.
            </p>

            <div className="grid grid-cols-1 gap-4 mt-12">
              {[
                { icon: Users, title: "Gestion complète", desc: "Participants & Jurys" },
                { icon: BarChart3, title: "Analytics avancés", desc: "Statistiques en temps réel" },
                { icon: Award, title: "Validation projets", desc: "Processus d'approbation" },
                { icon: TrendingUp, title: "Suivi des votes", desc: "Système pondéré 70/30" }
              ].map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                  className="flex items-center space-x-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg"
                >
                  <feature.icon className="w-6 h-6 text-red-200" />
                  <div>
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-red-200 text-sm">{feature.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-12 pt-8 border-t border-red-400/30"
          >
            <p className="text-red-200 text-sm">
              Journée de l&apos;Innovation et de la Gestion • Édition 2026
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Section droite - Formulaire de connexion */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50"
      >
        <div className="max-w-md w-full">
          
          {/* Header mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
            <p className="text-gray-600">JIG 2026</p>
          </div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200"
          >
            <div className="hidden lg:block text-center mb-8">
              <div className="flex justify-center mb-4">
                <Logo variant="red" size="md" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion Admin</h2>
              <p className="text-gray-600">Accédez au tableau de bord</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email administrateur
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="admin@jig2026.ci"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={motDePasse}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12 transition-all duration-200"
                    placeholder="••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-red-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
              >
                {loginMutation.isPending ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Accéder au Dashboard
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                <Users className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <p className="text-xs text-red-700 font-medium">Gestion</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                <BarChart3 className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <p className="text-xs text-red-700 font-medium">Analytics</p>
              </div>
              <div className="text-center p-3 bg-red-50 rounded-lg border border-red-100">
                <Settings className="w-5 h-5 text-red-600 mx-auto mb-1" />
                <p className="text-xs text-red-700 font-medium">Config</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 text-center"
          >
            <p className="text-sm text-gray-500">
              Dashboard sécurisé • JIG 2026 Administration
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}