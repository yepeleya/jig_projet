import { createNotification } from '../controllers/notification.controller.js';

export class NotificationService {
  
  static async onNewUser(user) {
    try {
      const titre = 'Nouvel utilisateur inscrit';
      const message = `${user.prenom} ${user.nom} (${user.email}) s'est inscrit avec le rôle ${user.role}`;
      
      await createNotification(
        'NOUVEAU_UTILISATEUR',
        titre,
        message,
        user.id,
        'user',
        {
          userRole: user.role,
          userEmail: user.email
        }
      );

      console.log(`📧 Notification créée : ${titre}`);
    } catch (error) {
      console.error('Erreur lors de la création de notification pour nouveau utilisateur:', error);
    }
  }

  static async onNewJury(jury) {
    try {
      const titre = 'Nouveau jury ajouté';
      const message = `${jury.prenom} ${jury.nom} a été ajouté comme jury${jury.specialite ? ` (spécialité: ${jury.specialite})` : ''}`;
      
      await createNotification(
        'NOUVEAU_JURY',
        titre,
        message,
        jury.id,
        'jury',
        {
          jurySpecialite: jury.specialite,
          juryEmail: jury.email
        }
      );

      console.log(`📧 Notification créée : ${titre}`);
    } catch (error) {
      console.error('Erreur lors de la création de notification pour nouveau jury:', error);
    }
  }

  static async onNewProjet(projet, user) {
    try {
      const titre = 'Nouveau projet soumis';
      const message = `"${projet.titre}" a été soumis par ${user.prenom} ${user.nom} dans la catégorie ${projet.categorie}`;
      
      await createNotification(
        'NOUVEAU_PROJET',
        titre,
        message,
        projet.id,
        'projet',
        {
          projetCategorie: projet.categorie,
          auteurNom: `${user.prenom} ${user.nom}`,
          auteurEmail: user.email
        }
      );

      console.log(`📧 Notification créée : ${titre}`);
    } catch (error) {
      console.error('Erreur lors de la création de notification pour nouveau projet:', error);
    }
  }

  static async onNewVote(vote, projet, voter) {
    try {
      const voterName = voter.nom ? `${voter.prenom} ${voter.nom}` : 'Utilisateur anonyme';
      const voterType = vote.typeVote === 'JURY' ? 'jury' : 'public';
      
      const titre = 'Nouveau vote enregistré';
      const message = `Un vote ${voterType} (${vote.valeur}/5) a été enregistré pour "${projet.titre}" par ${voterName}`;
      
      await createNotification(
        'NOUVEAU_VOTE',
        titre,
        message,
        vote.id,
        'vote',
        {
          projetTitre: projet.titre,
          projetId: projet.id,
          voteValeur: vote.valeur,
          voteType: vote.typeVote,
          voterName: voterName
        }
      );

      console.log(`📧 Notification créée : ${titre}`);
    } catch (error) {
      console.error('Erreur lors de la création de notification pour nouveau vote:', error);
    }
  }

  static async onProjetApproved(projet, user) {
    try {
      const titre = 'Projet approuvé';
      const message = `Le projet "${projet.titre}" de ${user.prenom} ${user.nom} a été approuvé et est maintenant visible publiquement`;
      
      await createNotification(
        'PROJET_APPROUVE',
        titre,
        message,
        projet.id,
        'projet',
        {
          projetCategorie: projet.categorie,
          auteurNom: `${user.prenom} ${user.nom}`
        }
      );

      console.log(`📧 Notification créée : ${titre}`);
    } catch (error) {
      console.error('Erreur lors de la création de notification pour projet approuvé:', error);
    }
  }

  static async onProjetRejected(projet, user, reason = null) {
    try {
      const titre = 'Projet rejeté';
      const message = `Le projet "${projet.titre}" de ${user.prenom} ${user.nom} a été rejeté${reason ? ` : ${reason}` : ''}`;
      
      await createNotification(
        'PROJET_REJETE',
        titre,
        message,
        projet.id,
        'projet',
        {
          projetCategorie: projet.categorie,
          auteurNom: `${user.prenom} ${user.nom}`,
          reason: reason
        }
      );

      console.log(`📧 Notification créée : ${titre}`);
    } catch (error) {
      console.error('Erreur lors de la création de notification pour projet rejeté:', error);
    }
  }

  static async onNewContact(contact) {
    try {
      const titre = 'Nouveau message de contact';
      const message = `Nouveau message de ${contact.nom} (${contact.email}) : "${contact.sujet}"`;
      
      await createNotification(
        'NOUVEAU_CONTACT',
        titre,
        message,
        contact.id,
        'contact',
        {
          contactNom: contact.nom,
          contactEmail: contact.email,
          contactSujet: contact.sujet
        }
      );

      console.log(`📧 Notification créée : ${titre}`);
    } catch (error) {
      console.error('Erreur lors de la création de notification pour nouveau contact:', error);
    }
  }

  static async onNewComment(commentaire, projet, jury) {
    try {
      const titre = 'Nouveau commentaire';
      const message = `${jury.prenom} ${jury.nom} a ajouté un commentaire sur le projet "${projet.titre}"`;
      
      await createNotification(
        'NOUVEAU_COMMENTAIRE',
        titre,
        message,
        commentaire.id,
        'commentaire',
        {
          projetTitre: projet.titre,
          projetId: projet.id,
          juryNom: `${jury.prenom} ${jury.nom}`,
          commentaire: commentaire.contenu.substring(0, 100) + '...'
        }
      );

      console.log(`📧 Notification créée : ${titre}`);
    } catch (error) {
      console.error('Erreur lors de la création de notification pour nouveau commentaire:', error);
    }
  }
}