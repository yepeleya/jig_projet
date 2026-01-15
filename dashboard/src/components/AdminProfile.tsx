'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiCamera, 
  FiSave, 
  FiEye, 
  FiEyeOff,
  FiTrash2,
  FiLock,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader
} from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import axios, { AxiosError } from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface AdminData {
  id: number
  nom: string
  prenom: string
  email: string
  telephone?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}

interface FormData {
  nom: string
  prenom: string
  email: string
  telephone?: string
  currentPassword?: string
  newPassword?: string
  confirmPassword?: string
}

interface Message {
  type: 'success' | 'error' | ''
  text: string
}

export default function AdminProfile() {
  const [adminData, setAdminData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [message, setMessage] = useState<Message>({ type: '', text: '' })
  
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FormData>()
  
  const newPassword = watch('newPassword')

  // Charger les données du profil administrateur
  const fetchAdminProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('admin-token')
      const response = await axios.get(`${API_BASE_URL}/admin/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      
      if (response.data.success) {
        setAdminData(response.data.data)
        reset({
          nom: response.data.data.nom,
          prenom: response.data.data.prenom,
          email: response.data.data.email,
          telephone: response.data.data.telephone || ''
        })
      }
    } catch {
      setMessage({
        type: 'error',
        text: 'Erreur lors du chargement du profil'
      })
    } finally {
      setLoading(false)
    }
  }, [reset])

  useEffect(() => {
    fetchAdminProfile()
  }, [fetchAdminProfile])

  const onSubmit = async (data: FormData) => {
    setUpdating(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('admin-token')
      const response = await axios.put(`${API_BASE_URL}/admin/profile`, data, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setAdminData(response.data.data)
        setMessage({
          type: 'success',
          text: 'Profil mis à jour avec succès'
        })
        
        // Effacer les champs de mot de passe
        reset({
          ...data,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      setMessage({
        type: 'error',
        text: axiosError.response?.data?.message || 'Erreur lors de la mise à jour'
      })
    } finally {
      setUpdating(false)
    }
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Vérification du type de fichier
    if (!file.type.startsWith('image/')) {
      setMessage({
        type: 'error',
        text: 'Veuillez sélectionner une image valide'
      })
      return
    }

    // Vérification de la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({
        type: 'error',
        text: 'L\'image ne doit pas dépasser 5MB'
      })
      return
    }

    setUploading(true)
    setMessage({ type: '', text: '' })

    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const token = localStorage.getItem('admin-token')
      const response = await axios.post(`${API_BASE_URL}/admin/profile/avatar`, formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })

      if (response.data.success) {
        setAdminData(response.data.data)
        setMessage({
          type: 'success',
          text: 'Photo de profil mise à jour avec succès'
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      setMessage({
        type: 'error',
        text: axiosError.response?.data?.message || 'Erreur lors de l\'upload'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteAvatar = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer votre photo de profil ?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin-token')
      const response = await axios.delete(`${API_BASE_URL}/admin/profile/avatar`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setAdminData(response.data.data)
        setMessage({
          type: 'success',
          text: 'Photo de profil supprimée avec succès'
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      setMessage({
        type: 'error',
        text: axiosError.response?.data?.message || 'Erreur lors de la suppression'
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-600">
          <FiLoader className="animate-spin text-xl" />
          <span>Chargement du profil...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mon Profil</h1>
        <p className="text-gray-600">Gérez vos informations personnelles et paramètres de sécurité</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Section Photo de profil */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Photo de profil</h2>
            
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg relative">
                  {adminData?.avatar ? (
                    <Image 
                      src={`${API_BASE_URL.replace('/api', '')}/uploads/avatars/${adminData.avatar}`}
                      alt="Avatar"
                      fill
                      className="object-cover"
                      sizes="128px"
                    />
                  ) : (
                    <FiUser className="text-4xl text-gray-400" />
                  )}
                </div>
                
                {uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <FiLoader className="text-white text-xl animate-spin" />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
                >
                  <FiCamera />
                  {uploading ? 'Upload...' : 'Changer la photo'}
                </button>

                {adminData?.avatar && (
                  <button
                    onClick={handleDeleteAvatar}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <FiTrash2 />
                    Supprimer
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              <p className="text-sm text-gray-500 mt-3">
                Formats acceptés: JPG, PNG, GIF<br />
                Taille max: 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Section Informations personnelles */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Informations personnelles</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Nom et Prénom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      {...register('nom', { required: 'Le nom est requis' })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Votre nom"
                    />
                  </div>
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600">{errors.nom.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      {...register('prenom', { required: 'Le prénom est requis' })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Votre prénom"
                    />
                  </div>
                  {errors.prenom && (
                    <p className="mt-1 text-sm text-red-600">{errors.prenom.message}</p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    {...register('email', { 
                      required: 'L\'email est requis',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Email invalide'
                      }
                    })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="votre@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Téléphone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    {...register('telephone')}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+225 01 02 03 04 05"
                  />
                </div>
              </div>

              {/* Section Changement de mot de passe */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <FiLock />
                  Changer le mot de passe
                </h3>

                <div className="space-y-4">
                  {/* Mot de passe actuel */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        {...register('currentPassword')}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Mot de passe actuel"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showCurrentPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                  </div>

                  {/* Nouveau mot de passe */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register('newPassword', {
                          minLength: {
                            value: 6,
                            message: 'Le mot de passe doit contenir au moins 6 caractères'
                          }
                        })}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Nouveau mot de passe"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </div>
                    {errors.newPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.newPassword.message}</p>
                    )}
                  </div>

                  {/* Confirmation mot de passe */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                      <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        {...register('confirmPassword', {
                          validate: value => {
                            if (newPassword && value !== newPassword) {
                              return 'Les mots de passe ne correspondent pas'
                            }
                          }
                        })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Confirmer le nouveau mot de passe"
                      />
                    </div>
                    {errors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bouton de soumission */}
              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={updating}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
                >
                  {updating ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Mise à jour...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Enregistrer les modifications
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}