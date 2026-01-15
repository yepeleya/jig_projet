'use client'

import { useQuery } from '@tanstack/react-query'
import { juryApi } from '@/lib/api'
import { Trophy, TrendingUp, Users, Star } from 'lucide-react'
import Link from 'next/link'

interface Score {
  projetId: number
  titre: string
  scoreFinal: number
  moyenneJury: number
  moyenneEtudiant: number
  totalVotesJury: number
  totalVotesEtudiants: number
}

export default function ResultatsPage() {
  const { data: scores, isLoading } = useQuery<Score[]>({
    queryKey: ['scores'],
    queryFn: juryApi.getScores
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-yellow-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Classement JIG 2026</h1>
                <p className="text-sm text-gray-600">Scores pondérés (Jury 70% - Étudiants 30%)</p>
              </div>
            </div>
            <Link
              href="/dashboard"
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retour au Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Podium */}
        {scores && scores.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">🏆 Podium JIG 2026 🏆</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              {/* 2ème place */}
              {scores[1] && (
                <div className="bg-gray-100 rounded-lg p-6 text-center order-1 md:order-1">
                  <div className="text-4xl mb-2">🥈</div>
                  <h3 className="font-bold text-lg text-gray-800">{scores[1].titre}</h3>
                  <p className="text-2xl font-bold text-gray-600 mt-2">{scores[1].scoreFinal}/10</p>
                  <div className="text-sm text-gray-500 mt-2">
                    <p>Jury: {scores[1].moyenneJury}/10</p>
                    <p>Étudiants: {scores[1].moyenneEtudiant}/10</p>
                  </div>
                </div>
              )}

              {/* 1ère place */}
              {scores[0] && (
                <div className="bg-yellow-100 rounded-lg p-6 text-center order-2 md:order-2 border-2 border-yellow-400">
                  <div className="text-5xl mb-2">🥇</div>
                  <h3 className="font-bold text-xl text-yellow-800">{scores[0].titre}</h3>
                  <p className="text-3xl font-bold text-yellow-700 mt-2">{scores[0].scoreFinal}/10</p>
                  <div className="text-sm text-yellow-600 mt-2">
                    <p>Jury: {scores[0].moyenneJury}/10</p>
                    <p>Étudiants: {scores[0].moyenneEtudiant}/10</p>
                  </div>
                </div>
              )}

              {/* 3ème place */}
              {scores[2] && (
                <div className="bg-orange-100 rounded-lg p-6 text-center order-3 md:order-3">
                  <div className="text-4xl mb-2">🥉</div>
                  <h3 className="font-bold text-lg text-orange-800">{scores[2].titre}</h3>
                  <p className="text-2xl font-bold text-orange-600 mt-2">{scores[2].scoreFinal}/10</p>
                  <div className="text-sm text-orange-500 mt-2">
                    <p>Jury: {scores[2].moyenneJury}/10</p>
                    <p>Étudiants: {scores[2].moyenneEtudiant}/10</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Classement complet */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Classement complet</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score Final
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vote Jury (70%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vote Étudiants (30%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participations
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {scores?.map((score: Score, index: number) => (
                  <tr key={score.projetId} className={index < 3 ? 'bg-yellow-50' : ''}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">
                          #{index + 1}
                        </span>
                        {index === 0 && <Trophy className="w-4 h-4 text-yellow-500 ml-2" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{score.titre}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm font-bold text-gray-900">{score.scoreFinal}/10</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{score.moyenneJury}/10</div>
                      <div className="text-xs text-gray-500">({score.totalVotesJury} votes)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{score.moyenneEtudiant}/10</div>
                      <div className="text-xs text-gray-500">({score.totalVotesEtudiants} votes)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Users className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">
                          {score.totalVotesJury + score.totalVotesEtudiants} total
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(!scores || scores.length === 0) && (
          <div className="text-center py-12">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun résultat disponible</h3>
            <p className="text-gray-600">Les résultats apparaîtront une fois que les votes seront effectués.</p>
          </div>
        )}
      </div>
    </div>
  )
}