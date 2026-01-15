import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedTestData() {
  try {
    console.log('🌱 Ajout de données de test...')

    // Hasher les mots de passe
    const hashedPassword = await bcrypt.hash('password123', 10)

    // 1. Créer des étudiants
    const etudiants = await Promise.all([
      prisma.user.create({
        data: {
          nom: 'Martin',
          prenom: 'Alice',
          email: 'alice.martin@etudiant.fr',
          motDePasse: hashedPassword,
          role: 'ETUDIANT',
          ecole: 'ISTC Polytechnique',
          filiere: 'Informatique',
          niveau: 'Master 1'
        }
      }),
      prisma.user.create({
        data: {
          nom: 'Dubois',
          prenom: 'Thomas',
          email: 'thomas.dubois@etudiant.fr',
          motDePasse: hashedPassword,
          role: 'ETUDIANT',
          ecole: 'ISTC Polytechnique',
          filiere: 'Intelligence Artificielle',
          niveau: 'Master 2'
        }
      }),
      prisma.user.create({
        data: {
          nom: 'Leroy',
          prenom: 'Emma',
          email: 'emma.leroy@etudiant.fr',
          motDePasse: hashedPassword,
          role: 'ETUDIANT',
          ecole: 'ISTC Polytechnique',
          filiere: 'Cybersécurité',
          niveau: 'Master 1'
        }
      }),
      prisma.user.create({
        data: {
          nom: 'Garcia',
          prenom: 'Lucas',
          email: 'lucas.garcia@etudiant.fr',
          motDePasse: hashedPassword,
          role: 'ETUDIANT',
          ecole: 'ISTC Polytechnique',
          filiere: 'Développement Web',
          niveau: 'Master 2'
        }
      }),
      prisma.user.create({
        data: {
          nom: 'Moreau',
          prenom: 'Léa',
          email: 'lea.moreau@etudiant.fr',
          motDePasse: hashedPassword,
          role: 'ETUDIANT',
          ecole: 'ISTC Polytechnique',
          filiere: 'Data Science',
          niveau: 'Master 1'
        }
      })
    ])

    console.log('✅ Étudiants créés:', etudiants.length)

    // 2. Créer des utilisateurs publics
    const utilisateurs = await Promise.all([
      prisma.user.create({
        data: {
          nom: 'Visiteur',
          prenom: 'Public',
          email: 'public1@example.com',
          motDePasse: hashedPassword,
          role: 'UTILISATEUR'
        }
      }),
      prisma.user.create({
        data: {
          nom: 'Observateur',
          prenom: 'Beta',
          email: 'public2@example.com',
          motDePasse: hashedPassword,
          role: 'UTILISATEUR'
        }
      })
    ])

    console.log('✅ Utilisateurs publics créés:', utilisateurs.length)

    // 3. Créer des jurys
    const jurys = await Promise.all([
      prisma.jury.create({
        data: {
          nom: 'Professeur',
          prenom: 'Jean',
          email: 'jean.professeur@istc.fr',
          motDePasse: hashedPassword,
          specialite: 'Intelligence Artificielle',
          bio: 'Expert en IA avec 15 ans d\'expérience dans le domaine.'
        }
      }),
      prisma.jury.create({
        data: {
          nom: 'Experte',
          prenom: 'Marie',
          email: 'marie.experte@tech.com',
          motDePasse: hashedPassword,
          specialite: 'Développement Web',
          bio: 'Lead Developer chez TechCorp, spécialisée en technologies web modernes.'
        }
      }),
      prisma.jury.create({
        data: {
          nom: 'Chercheur',
          prenom: 'Paul',
          email: 'paul.chercheur@research.fr',
          motDePasse: hashedPassword,
          specialite: 'Cybersécurité',
          bio: 'Chercheur en cybersécurité, auteur de plusieurs publications scientifiques.'
        }
      })
    ])

    console.log('✅ Jurys créés:', jurys.length)

    // 4. Créer des projets
    const projets = await Promise.all([
      prisma.projet.create({
        data: {
          titre: 'Assistant IA pour l\'éducation',
          description: 'Un chatbot intelligent utilisant GPT pour aider les étudiants dans leurs apprentissages. Le système peut répondre aux questions, proposer des exercices personnalisés et suivre les progrès de chaque étudiant.',
          categorie: 'Intelligence Artificielle',
          statut: 'APPROUVE',
          userId: etudiants[0].id,
          image: '/images/projets/ia-education.jpg'
        }
      }),
      prisma.projet.create({
        data: {
          titre: 'Plateforme E-commerce Écologique',
          description: 'Une marketplace dédiée aux produits écologiques et durables. Intègre un système de notation environnementale, de traçabilité des produits et de compensation carbone automatique.',
          categorie: 'Développement Web',
          statut: 'APPROUVE',
          userId: etudiants[1].id,
          image: '/images/projets/ecommerce-eco.jpg'
        }
      }),
      prisma.projet.create({
        data: {
          titre: 'Système de Détection d\'Intrusions IoT',
          description: 'Solution de cybersécurité spécialement conçue pour les objets connectés. Utilise l\'apprentissage automatique pour détecter les comportements anormaux et prévenir les attaques.',
          categorie: 'Cybersécurité',
          statut: 'APPROUVE',
          userId: etudiants[2].id,
          image: '/images/projets/cybersec-iot.jpg'
        }
      }),
      prisma.projet.create({
        data: {
          titre: 'Application Mobile de Santé Mentale',
          description: 'App mobile offrant des outils de méditation guidée, suivi de l\'humeur et connexion avec des professionnels de santé. Interface intuitive et respect total de la confidentialité.',
          categorie: 'Développement Mobile',
          statut: 'APPROUVE',
          userId: etudiants[3].id,
          image: '/images/projets/sante-mentale.jpg'
        }
      }),
      prisma.projet.create({
        data: {
          titre: 'Analyse Prédictive du Trafic Urbain',
          description: 'Système d\'analyse de données massives pour prédire les embouteillages et optimiser les trajets en temps réel. Intègre données météo, événements et historique de trafic.',
          categorie: 'Data Science',
          statut: 'APPROUVE',
          userId: etudiants[4].id,
          image: '/images/projets/trafic-prediction.jpg'
        }
      }),
      prisma.projet.create({
        data: {
          titre: 'Blockchain pour la Traçabilité Alimentaire',
          description: 'Solution blockchain permettant de tracer l\'origine et le parcours des aliments de la ferme à l\'assiette. Garantit la transparence et lutte contre la fraude alimentaire.',
          categorie: 'Blockchain',
          statut: 'APPROUVE',
          userId: etudiants[0].id,
          image: '/images/projets/blockchain-food.jpg'
        }
      })
    ])

    console.log('✅ Projets créés:', projets.length)

    // 5. Créer des votes du jury
    const votesJury = []
    for (const jury of jurys) {
      for (const projet of projets) {
        // Chaque jury vote pour chaque projet (note entre 3 et 5)
        const note = Math.random() * 2 + 3 // Entre 3.0 et 5.0
        votesJury.push(
          prisma.vote.create({
            data: {
              valeur: parseFloat(note.toFixed(1)),
              typeVote: 'JURY',
              projetId: projet.id,
              juryId: jury.id
            }
          })
        )
      }
    }

    await Promise.all(votesJury)
    console.log('✅ Votes jury créés:', votesJury.length)

    // 6. Créer des votes publics
    const votesPublic = []
    
    // Votes des utilisateurs publics
    for (const user of utilisateurs) {
      // Chaque utilisateur vote pour 3-4 projets aléatoires
      const projetsToVote = projets.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 3)
      
      for (const projet of projetsToVote) {
        const note = Math.random() * 2 + 2.5 // Entre 2.5 et 4.5 pour le public
        votesPublic.push(
          prisma.vote.create({
            data: {
              valeur: parseFloat(note.toFixed(1)),
              typeVote: 'UTILISATEUR',
              projetId: projet.id,
              userId: user.id
            }
          })
        )
      }
    }

    // Votes des étudiants (ils peuvent voter pour les projets des autres)
    for (const etudiant of etudiants) {
      // Chaque étudiant vote pour 2-3 projets (pas le sien)
      const autresProjets = projets.filter(p => p.userId !== etudiant.id)
      const projetsToVote = autresProjets.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 2)
      
      for (const projet of projetsToVote) {
        const note = Math.random() * 1.5 + 3 // Entre 3.0 et 4.5 pour les étudiants
        votesPublic.push(
          prisma.vote.create({
            data: {
              valeur: parseFloat(note.toFixed(1)),
              typeVote: 'ETUDIANT',
              projetId: projet.id,
              userId: etudiant.id
            }
          })
        )
      }
    }

    await Promise.all(votesPublic)
    console.log('✅ Votes publics créés:', votesPublic.length)

    // 7. Mettre à jour les statistiques des projets
    for (const projet of projets) {
      const votes = await prisma.vote.findMany({
        where: { projetId: projet.id }
      })

      const totalVotes = votes.length
      const moyenneVote = totalVotes > 0 
        ? votes.reduce((sum, vote) => sum + vote.valeur, 0) / totalVotes
        : 0

      await prisma.projet.update({
        where: { id: projet.id },
        data: {
          totalVotes,
          moyenneVote: parseFloat(moyenneVote.toFixed(2))
        }
      })
    }

    console.log('✅ Statistiques des projets mises à jour')

    // Afficher un résumé
    const stats = await prisma.$transaction([
      prisma.user.count(),
      prisma.jury.count(),
      prisma.projet.count(),
      prisma.vote.count()
    ])

    console.log('\n🎉 Données de test ajoutées avec succès !')
    console.log(`📊 Résumé :`)
    console.log(`   - Utilisateurs : ${stats[0]}`)
    console.log(`   - Jurys : ${stats[1]}`)
    console.log(`   - Projets : ${stats[2]}`)
    console.log(`   - Votes : ${stats[3]}`)
    console.log('\n🔑 Comptes de test créés :')
    console.log('   Étudiants : alice.martin@etudiant.fr, thomas.dubois@etudiant.fr, etc.')
    console.log('   Jurys : jean.professeur@istc.fr, marie.experte@tech.com, etc.')
    console.log('   Utilisateurs : public1@example.com, public2@example.com')
    console.log('   Mot de passe pour tous : password123')

  } catch (error) {
    console.error('❌ Erreur lors de l\'ajout des données de test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedTestData()