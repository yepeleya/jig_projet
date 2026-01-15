'use client';

export default function HomePage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(to bottom right, #dbeafe, #e0e7ff)',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ 
        textAlign: 'center', 
        maxWidth: '800px', 
        margin: '0 auto', 
        padding: '20px'
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          marginBottom: '24px' 
        }}>
          JIG 2026
        </h1>
        <h2 style={{ 
          fontSize: '1.5rem', 
          color: '#6b7280', 
          marginBottom: '32px' 
        }}>
          Concours Innovation et Génie Étudiant
        </h2>
        <p style={{ 
          fontSize: '1.125rem', 
          color: '#374151', 
          marginBottom: '48px',
          lineHeight: '1.6'
        }}>
          Plateforme de soumission et d'évaluation des projets innovants. 
          Participez au concours, soumettez vos projets et votez !
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px',
          marginTop: '48px'
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
            padding: '24px'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '12px' 
            }}>👥 Participants</h3>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Inscrivez-vous et soumettez vos projets
            </p>
            <a 
              href="/register" 
              style={{ 
                display: 'inline-block', 
                background: '#3b82f6', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '4px', 
                textDecoration: 'none'
              }}
            >
              S'inscrire
            </a>
          </div>
          
          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
            padding: '24px'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '12px' 
            }}>🗳️ Voter</h3>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Découvrez et votez pour les projets
            </p>
            <a 
              href="/voter" 
              style={{ 
                display: 'inline-block', 
                background: '#10b981', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '4px', 
                textDecoration: 'none'
              }}
            >
              Voter
            </a>
          </div>
          
          <div style={{ 
            background: 'white', 
            borderRadius: '8px', 
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', 
            padding: '24px'
          }}>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: '#1f2937', 
              marginBottom: '12px' 
            }}>⚖️ Jury</h3>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Interface d'évaluation
            </p>
            <a 
              href="/jury" 
              style={{ 
                display: 'inline-block', 
                background: '#8b5cf6', 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '4px', 
                textDecoration: 'none'
              }}
            >
              Interface Jury
            </a>
          </div>
        </div>
        
        <div style={{ marginTop: '32px', fontSize: '0.875rem', color: '#9ca3af' }}>
          <p>Backend API: <a href="https://jig2026.up.railway.app" style={{ color: '#3b82f6' }}>jig2026.up.railway.app</a></p>
        </div>
      </div>
    </div>
  )
}