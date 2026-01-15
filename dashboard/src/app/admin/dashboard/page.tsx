'use client'

import { useQuery } from '@tanstack/react-query'
import { adminApi } from '@/lib/api'
import { 
  Users, 
  Scale, 
  FolderOpen, 
  Vote, 
  MessageSquare, 
  TrendingUp,
  Award,
  Calendar
} from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Pie, Line } from 'react-chartjs-2'

// Enregistrement des composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

interface StatsCard {
  title: string
  value: number
  icon: React.ElementType
  color: string
  bgColor: string
  change?: number
}

export default function DashboardPage() {
  // Récupération des données depuis l'API avec les vraies routes
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.getUsers()
  })

  // Récupération directe des statistiques calculées
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats
  })

  // Calcul des statistiques pour l'affichage des cartes
  const stats: StatsCard[] = [
    {
      title: 'Total Participants',
      value: statsData?.etudiantCount || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      change: 12
    },
    {
      title: 'Utilisateurs',
      value: statsData?.utilisateurCount || 0,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: 8
    },
    {
      title: 'Membres du Jury',
      value: statsData?.juryCount || 0,
      icon: Scale,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      change: 5
    },
    {
      title: 'Projets Soumis',
      value: statsData?.projetCount || 0,
      icon: FolderOpen,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      change: 15
    },
    {
      title: 'Projets Approuvés',
      value: statsData?.projetApprouveCount || 0,
      icon: Award,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      change: 20
    },
    {
      title: 'Total Votes',
      value: statsData?.voteCount || 0,
      icon: Vote,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      change: 25
    },
    {
      title: 'Commentaires',
      value: statsData?.commentaireCount || 0,
      icon: MessageSquare,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      change: 18
    },
    {
      title: 'Moyenne Notes',
      value: Number((statsData?.moyenneVotes || 0).toFixed(1)),
      icon: TrendingUp,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      change: 5
    }
  ]

  // Données RÉELLES pour le graphique en secteurs (répartition des projets par catégorie)
  const categoriesData = {
    labels: statsData?.projetsByCategorie?.map(cat => cat.categorie) || ['Aucune donnée'],
    datasets: [
      {
        data: statsData?.projetsByCategorie?.map(cat => cat._count.id) || [0],
        backgroundColor: [
          '#ef4444',
          '#f97316',
          '#eab308',
          '#22c55e',
          '#3b82f6',
          '#8b5cf6',
          '#ec4899',
          '#06b6d4'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  }

  // Données RÉELLES pour le graphique des inscriptions (7 derniers jours)
  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      days.push(date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }))
    }
    return days
  }

  const inscriptionsData = {
    labels: getLast7Days(),
    datasets: [
      {
        label: 'Nouvelles inscriptions',
        data: statsData?.inscriptionsLastWeek || [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderColor: '#ef4444',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  }

  // Configuration des graphiques
  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Répartition des projets par catégorie'
      }
    }
  }

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Évolution des inscriptions (7 derniers jours)'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }

  if (usersLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-2">Vue d&apos;ensemble de la JIG 2026</p>
      </div>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value.toLocaleString()}</p>
                  {stat.change && (
                    <div className="flex items-center mt-2">
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">+{stat.change}%</span>
                      <span className="text-sm text-gray-500 ml-1">ce mois</span>
                    </div>
                  )}
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Graphique en secteurs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="h-80">
            <Pie data={categoriesData} options={pieOptions} />
          </div>
        </div>

        {/* Graphique linéaire */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="h-80">
            <Line data={inscriptionsData} options={lineOptions} />
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {users.slice(-5).map((user) => (
              <div key={user.id} className="flex items-center space-x-4 py-3 border-b last:border-b-0 border-gray-100">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user.prenom} {user.nom} s&apos;est inscrit
                  </p>
                  <p className="text-xs text-gray-500">
                    Rôle: {user.role} • {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div className="text-xs text-gray-400">
                  <Calendar className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}