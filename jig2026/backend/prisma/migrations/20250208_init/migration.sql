-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'JURY', 'ETUDIANT', 'UTILISATEUR');

-- CreateEnum
CREATE TYPE "TypeVote" AS ENUM ('JURY', 'ETUDIANT', 'UTILISATEUR');

-- CreateEnum
CREATE TYPE "StatutProjet" AS ENUM ('EN_ATTENTE', 'EN_COURS', 'EVALUE', 'TERMINE', 'APPROUVE', 'REJETE', 'SUSPENDU');

-- CreateEnum
CREATE TYPE "StatutContact" AS ENUM ('NOUVEAU', 'EN_COURS', 'RESOLU', 'FERME');

-- CreateEnum
CREATE TYPE "TypeNotification" AS ENUM ('NOUVEAU_UTILISATEUR', 'NOUVEAU_JURY', 'NOUVEAU_PROJET', 'NOUVEAU_VOTE', 'PROJET_APPROUVE', 'PROJET_REJETE', 'NOUVEAU_COMMENTAIRE', 'NOUVEAU_CONTACT');

-- CreateEnum
CREATE TYPE "TypeReaction" AS ENUM ('COMMENTAIRE', 'VOTE', 'MODIFICATION', 'AVIS_JURY', 'VALIDATION', 'REJET', 'DEMANDE_MODIFICATION', 'APPROBATION', 'NOTE_INTERNE');

-- CreateEnum
CREATE TYPE "TypeContenu" AS ENUM ('TEXT', 'HTML', 'MARKDOWN', 'IMAGE', 'JSON');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'UTILISATEUR',
    "telephone" TEXT,
    "ecole" TEXT,
    "filiere" TEXT,
    "niveau" TEXT,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jury" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "specialite" TEXT,
    "bio" TEXT,
    "photo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jury_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projet" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categorie" TEXT NOT NULL,
    "fichier" TEXT,
    "image" TEXT,
    "statut" "StatutProjet" NOT NULL DEFAULT 'EN_ATTENTE',
    "userId" INTEGER,
    "moyenneVote" DOUBLE PRECISION DEFAULT 0,
    "totalVotes" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vote" (
    "id" SERIAL NOT NULL,
    "valeur" DOUBLE PRECISION NOT NULL,
    "typeVote" "TypeVote" NOT NULL,
    "projetId" INTEGER NOT NULL,
    "userId" INTEGER,
    "juryId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentaire" (
    "id" SERIAL NOT NULL,
    "contenu" TEXT NOT NULL,
    "projetId" INTEGER NOT NULL,
    "juryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "commentaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "programme" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3) NOT NULL,
    "lieu" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "intervenant" TEXT,
    "image" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "programme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "galerie" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT NOT NULL,
    "categorie" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "galerie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "sujet" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "statut" "StatutContact" NOT NULL DEFAULT 'NOUVEAU',
    "reponse" TEXT,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "configuration" (
    "id" SERIAL NOT NULL,
    "cle" TEXT NOT NULL,
    "valeur" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'string',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "configuration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "type" "TypeNotification" NOT NULL,
    "titre" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "entityId" INTEGER,
    "entityType" TEXT,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projet_suivi" (
    "id" SERIAL NOT NULL,
    "projetId" INTEGER NOT NULL,
    "userId" INTEGER,
    "juryId" INTEGER,
    "typeReaction" "TypeReaction" NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" TEXT,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projet_suivi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contenu_site" (
    "id" SERIAL NOT NULL,
    "cle" TEXT NOT NULL,
    "titre" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "type" "TypeContenu" NOT NULL DEFAULT 'TEXT',
    "page" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "description" TEXT,
    "ordre" INTEGER NOT NULL DEFAULT 0,
    "actif" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contenu_site_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "jury_email_key" ON "jury"("email");

-- CreateIndex
CREATE UNIQUE INDEX "vote_projetId_userId_key" ON "vote"("projetId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "vote_projetId_juryId_key" ON "vote"("projetId", "juryId");

-- CreateIndex
CREATE UNIQUE INDEX "configuration_cle_key" ON "configuration"("cle");

-- CreateIndex
CREATE UNIQUE INDEX "contenu_site_cle_key" ON "contenu_site"("cle");

-- AddForeignKey
ALTER TABLE "projet" ADD CONSTRAINT "projet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vote" ADD CONSTRAINT "vote_juryId_fkey" FOREIGN KEY ("juryId") REFERENCES "jury"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentaire" ADD CONSTRAINT "commentaire_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentaire" ADD CONSTRAINT "commentaire_juryId_fkey" FOREIGN KEY ("juryId") REFERENCES "jury"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact" ADD CONSTRAINT "contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projet_suivi" ADD CONSTRAINT "projet_suivi_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "projet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projet_suivi" ADD CONSTRAINT "projet_suivi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projet_suivi" ADD CONSTRAINT "projet_suivi_juryId_fkey" FOREIGN KEY ("juryId") REFERENCES "jury"("id") ON DELETE SET NULL ON UPDATE CASCADE;