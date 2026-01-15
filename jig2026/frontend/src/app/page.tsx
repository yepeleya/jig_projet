'use client';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center max-w-4xl mx-auto px-4">
        <h1 className="text-6xl font-bold text-gray-800 mb-6">
          JIG 2026
        </h1>
        <h2 className="text-2xl text-gray-600 mb-8">
          Concours d'Innovation et de Génie Étudiant
        </h2>
        <p className="text-lg text-gray-700 mb-12 max-w-2xl mx-auto">
          Plateforme de soumission et d'évaluation des projets innovants. 
          Participez au concours, soumettez vos projets et votez pour les meilleures innovations !
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">👥 Participants</h3>
            <p className="text-gray-600">Inscrivez-vous et soumettez vos projets innovants</p>
            <a href="/register" className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              S'inscrire
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">🗳️ Voter</h3>
            <p className="text-gray-600">Découvrez et votez pour les projets</p>
            <a href="/voter" className="mt-4 inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Voter
            </a>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">⚖️ Jury</h3>
            <p className="text-gray-600">Interface d'évaluation pour les jurys</p>
            <a href="/jury" className="mt-4 inline-block bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
              Interface Jury
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
