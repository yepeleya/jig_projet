import pkg from '@prisma/client';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Début du seeding...')

  // Nettoyer les données existantes
  await prisma.vote.deleteMany()
  await prisma.commentaire.deleteMany()
  await prisma.contact.deleteMany()
  await prisma.projet.deleteMany()
  await prisma.jury.deleteMany()
  await prisma.user.deleteMany()
  await prisma.galerie.deleteMany()
  await prisma.programme.deleteMany()
  await prisma.configuration.deleteMany()

  // Créer un admin
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.create({
    data: {
      nom: 'Yeo',
      prenom: 'Tenena',
      email: 'tenenayeo@jig2026.ci',
      motDePasse: adminPassword,
      role: 'ADMIN'
    }
  })

  // Créer des étudiants
  const students = [
    {
      nom: 'Koné',
      prenom: 'Adama',
      email: 'adama.kone@istc.ci',
      filiere: 'Infographie 2D/3D',
      niveau: 'Master 1'
    },
    {
      nom: 'Diabaté',
      prenom: 'Mariam',
      email: 'mariam.diabate@istc.ci',
      filiere: 'Développement Web',
      niveau: 'Master 2'
    },
    {
      nom: 'Bamba',
      prenom: 'Seydou',
      email: 'seydou.bamba@istc.ci',
      filiere: 'Photographie',
      niveau: 'Licence 3'
    },
    {
      nom: 'Touré',
      prenom: 'Fatou',
      email: 'fatou.toure@istc.ci',
      filiere: 'PAO',
      niveau: 'Master 1'
    },
    {
      nom: 'Yao',
      prenom: 'Jean-Claude',
      email: 'jean.yao@istc.ci',
      filiere: 'Animation 3D',
      niveau: 'Master 2'
    },
    {
      nom: 'Kouassi',
      prenom: 'Aya',
      email: 'aya.kouassi@istc.ci',
      filiere: 'UX/UI Design',
      niveau: 'Master 1'
    }
  ]

  const createdStudents = []
  for (const student of students) {
    const password = await bcrypt.hash('password123', 12)
    const user = await prisma.user.create({
      data: {
        ...student,
        motDePasse: password,
        role: 'ETUDIANT',
        telephone: '+225 07 ' + Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
      }
    })
    createdStudents.push(user)
  }

  // Créer des jurys
  const juries = [
    {
      nom: 'Silué',
      prenom: 'Paul Emmanuel',
      email: 'paul.silue@istc.ci',
      specialite: 'Design Graphique',
      bio: 'Expert en design graphique avec 15 ans d\'expérience dans l\'industrie créative.'
    },
    {
      nom: 'Assi',
      prenom: 'Marie-Claire',
      email: 'marie.assi@istc.ci',
      specialite: 'Développement Web',
      bio: 'Développeuse senior et formatrice en technologies web modernes.'
    },
    {
      nom: 'Kouamé',
      prenom: 'Didier',
      email: 'didier.kouame@istc.ci',
      specialite: 'Photographie',
      bio: 'Photographe professionnel et directeur artistique reconnu.'
    }
  ]

  const createdJuries = []
  for (const jury of juries) {
    const password = await bcrypt.hash('jury123', 12)
    const juryUser = await prisma.jury.create({
      data: {
        ...jury,
        motDePasse: password
      }
    })
    createdJuries.push(juryUser)
  }

  // Créer des projets
  const projets = [
    {
      titre: 'Motion Design ISTC',
      description: 'Animation promotionnelle pour l\'ISTC avec effets de transition modernes et typographie dynamique. Ce projet explore les techniques d\'animation 2D avancées.',
      categorie: 'Animation 2D',
      userId: createdStudents[0].id,
      statut: 'APPROUVE'
    },
    {
      titre: 'Portfolio Web Interactif',
      description: 'Site portfolio responsive avec animations CSS avancées et interface utilisateur moderne. Développé avec React et Tailwind CSS.',
      categorie: 'Développement Web',
      userId: createdStudents[1].id,
      statut: 'APPROUVE'
    },
    {
      titre: 'Série Photo Portrait',
      description: 'Série de portraits artistiques explorant l\'identité culturelle ivoirienne contemporaine. Technique de studio et post-production avancée.',
      categorie: 'Photographie',
      userId: createdStudents[2].id,
      statut: 'APPROUVE'
    },
    {
      titre: 'Identité Visuelle StartUp',
      description: 'Création complète d\'identité visuelle pour une startup tech : logo, charte graphique, supports de communication.',
      categorie: 'PAO',
      userId: createdStudents[3].id,
      statut: 'APPROUVE'
    },
    {
      titre: 'Animation 3D Architectural',
      description: 'Visite virtuelle 3D d\'un complexe résidentiel moderne avec rendu photoréaliste. Modélisation, texturing et lighting avancés.',
      categorie: 'Animation 3D',
      userId: createdStudents[4].id,
      statut: 'APPROUVE'
    },
    {
      titre: 'Application Mobile UI/UX',
      description: 'Interface et expérience utilisateur pour une application de covoiturage local. Recherche utilisateur, wireframes et prototypage.',
      categorie: 'Design UX/UI',
      userId: createdStudents[5].id,
      statut: 'APPROUVE'
    }
  ]

  const createdProjets = []
  for (const projet of projets) {
    const createdProjet = await prisma.projet.create({
      data: projet
    })
    createdProjets.push(createdProjet)
  }

  // Créer des votes
  const votes = []
  for (const projet of createdProjets) {
    // Votes des jurys
    for (const jury of createdJuries) {
      const vote = await prisma.vote.create({
        data: {
          projetId: projet.id,
          juryId: jury.id,
          valeur: Math.random() * 2 + 3, // Entre 3 et 5
          typeVote: 'JURY'
        }
      })
      votes.push(vote)
    }

    // Votes des étudiants (quelques-uns)
    const randomStudents = createdStudents
      .filter(s => s.id !== projet.userId)
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 2)

    for (const student of randomStudents) {
      const vote = await prisma.vote.create({
        data: {
          projetId: projet.id,
          userId: student.id,
          valeur: Math.random() * 2 + 3, // Entre 3 et 5
          typeVote: 'ETUDIANT'
        }
      })
      votes.push(vote)
    }
  }

  // Créer des commentaires
  for (const projet of createdProjets) {
    for (const jury of createdJuries.slice(0, 2)) {
      await prisma.commentaire.create({
        data: {
          projetId: projet.id,
          juryId: jury.id,
          contenu: `Excellent travail sur ce projet. La qualité technique et la créativité sont au rendez-vous. Quelques améliorations possibles sur la présentation finale.`
        }
      })
    }
  }

  // Créer des éléments de galerie
  const galerieItems = [
    {
      titre: 'JIG 2023 - Cérémonie d\'ouverture',
      description: 'Photos de la cérémonie d\'ouverture de l\'édition 2023',
      image: 'galerie-1.jpg',
      categorie: 'Événements',
      ordre: 1
    },
    {
      titre: 'Exposition des projets 2023',
      description: 'Découvrez les meilleurs projets de l\'année passée',
      image: 'galerie-2.jpg',
      categorie: 'Projets',
      ordre: 2
    },
    {
      titre: 'Ateliers et formations',
      description: 'Moments forts des ateliers proposés aux étudiants',
      image: 'galerie-3.jpg',
      categorie: 'Formation',
      ordre: 3
    }
  ]

  for (const item of galerieItems) {
    await prisma.galerie.create({
      data: item
    })
  }

  // Créer le programme
  const programmes = [
    {
      titre: 'Cérémonie d\'ouverture',
      description: 'Accueil des participants et présentation officielle de la JIG 2026',
      dateDebut: new Date('2026-03-15T09:00:00'),
      dateFin: new Date('2026-03-15T10:30:00'),
      lieu: 'Amphithéâtre ISTC',
      type: 'Cérémonie',
      intervenant: 'Direction ISTC Polytechnique',
      ordre: 1
    },
    {
      titre: 'Conférence : L\'IA dans le Design',
      description: 'Impact de l\'intelligence artificielle sur les métiers créatifs',
      dateDebut: new Date('2026-03-15T11:00:00'),
      dateFin: new Date('2026-03-15T12:30:00'),
      lieu: 'Salle de conférence',
      type: 'Conférence',
      intervenant: 'Dr. Amina Koné, Expert IA',
      ordre: 2
    },
    {
      titre: 'Atelier Motion Design',
      description: 'Techniques avancées d\'animation et d\'effets visuels',
      dateDebut: new Date('2026-03-15T14:00:00'),
      dateFin: new Date('2026-03-15T17:00:00'),
      lieu: 'Lab Créatif A',
      type: 'Atelier',
      intervenant: 'Studio MotionCraft',
      ordre: 3
    },
    {
      titre: 'Présentation des projets',
      description: 'Les étudiants présentent leurs réalisations au jury',
      dateDebut: new Date('2026-03-16T09:00:00'),
      dateFin: new Date('2026-03-16T12:00:00'),
      lieu: 'Espace d\'exposition',
      type: 'Présentation',
      ordre: 4
    },
    {
      titre: 'Cérémonie de clôture et remise des prix',
      description: 'Annonce des résultats et remise des prix aux lauréats',
      dateDebut: new Date('2026-03-16T15:00:00'),
      dateFin: new Date('2026-03-16T17:00:00'),
      lieu: 'Amphithéâtre ISTC',
      type: 'Cérémonie',
      intervenant: 'Jury et Direction',
      ordre: 5
    }
  ]

  for (const programme of programmes) {
    await prisma.programme.create({
      data: programme
    })
  }

  // Mettre à jour les statistiques des projets
  for (const projet of createdProjets) {
    const votesForProject = await prisma.vote.findMany({
      where: { projetId: projet.id }
    })

    if (votesForProject.length > 0) {
      const votesJury = votesForProject.filter(v => v.typeVote === 'JURY')
      const votesEtudiants = votesForProject.filter(v => v.typeVote === 'ETUDIANT')

      const moyenneJury = votesJury.length > 0 
        ? votesJury.reduce((sum, v) => sum + v.valeur, 0) / votesJury.length 
        : 0

      const moyenneEtudiants = votesEtudiants.length > 0 
        ? votesEtudiants.reduce((sum, v) => sum + v.valeur, 0) / votesEtudiants.length 
        : 0

      // Score pondéré (70% jury, 30% étudiants)
      const scoreTotal = (moyenneJury * 0.7) + (moyenneEtudiants * 0.3)

      await prisma.projet.update({
        where: { id: projet.id },
        data: {
          moyenneVote: scoreTotal,
          totalVotes: votesForProject.length
        }
      })
    }
  }

  console.log('✅ Seeding terminé avec succès!')
  console.log(`👤 Admin créé: ${admin.email} / admin123`)
  console.log(`🎓 ${createdStudents.length} étudiants créés`)
  console.log(`👨‍⚖️ ${createdJuries.length} jurys créés`)
  console.log(`🚀 ${createdProjets.length} projets créés`)
  console.log(`🗳️ ${votes.length} votes créés`)
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })