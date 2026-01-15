import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configuration du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = 'src/uploads/'
    
    // Définir le dossier selon le type de fichier
    if (file.fieldname === 'projet') {
      uploadPath += 'projets/'
    } else if (file.fieldname === 'image') {
      uploadPath += 'images/'
    } else if (file.fieldname === 'galerie') {
      uploadPath += 'galerie/'
    } else if (file.fieldname === 'avatar') {
      uploadPath += 'avatars/'
    } else {
      uploadPath += 'autres/'
    }
    
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    // Générer un nom unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const extension = path.extname(file.originalname)
    const fileName = `${file.fieldname}-${uniqueSuffix}${extension}`
    cb(null, fileName)
  }
})

// Filtrer les types de fichiers
const fileFilter = (req, file, cb) => {
  // Images autorisées
  if (file.fieldname === 'image' || file.fieldname === 'galerie') {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Seules les images sont autorisées'), false)
    }
  }
  // Fichiers de projet (documents + images)
  else if (file.fieldname === 'projet') {
    const allowedTypes = [
      'image/',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'video/mp4',
      'video/avi',
      'video/quicktime'
    ]
    
    if (allowedTypes.some(type => file.mimetype.startsWith(type))) {
      cb(null, true)
    } else {
      cb(new Error('Type de fichier non autorisé'), false)
    }
  } else {
    cb(null, true)
  }
}

// Configuration Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: 5 // Maximum 5 fichiers
  }
})

// Middlewares spécifiques
export const uploadProjet = upload.fields([
  { name: 'projet', maxCount: 1 },
  { name: 'image', maxCount: 1 }
])

export const uploadImage = upload.single('image')

export const uploadGalerie = upload.single('galerie')

export const uploadAvatar = upload.single('avatar')

export const uploadMultiple = upload.array('files', 5)

export default upload