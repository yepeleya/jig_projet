import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  try {
    const { filename } = params;
    
    // URL du backend pour récupérer la vidéo
    const backendBaseUrl = 'https://jig-projet-1.onrender.com' // FORCE RENDER
    const backendUrl = `${backendBaseUrl}/uploads/${filename}`;
    
    // Récupérer les headers de la requête client
    const range = request.headers.get('range');
    
    // Headers pour la requête vers le backend
    const headers = {};
    if (range) {
      headers['Range'] = range;
    }
    
    console.log(`🎥 Proxy vidéo: ${filename} ${range ? `(Range: ${range})` : ''}`);
    
    // Faire la requête vers le backend
    const response = await fetch(backendUrl, {
      headers,
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Vidéo non trouvée' },
        { status: 404 }
      );
    }
    
    // Récupérer le contenu
    const videoBuffer = await response.arrayBuffer();
    
    // Headers de réponse
    const responseHeaders = {
      'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Cache-Control': 'public, max-age=31536000',
    };
    
    // Si c'est une requête Range, copier les headers appropriés
    if (response.headers.get('Content-Range')) {
      responseHeaders['Content-Range'] = response.headers.get('Content-Range');
    }
    
    if (response.headers.get('Content-Length')) {
      responseHeaders['Content-Length'] = response.headers.get('Content-Length');
    }
    
    // Retourner la réponse avec le bon statut
    return new NextResponse(videoBuffer, {
      status: response.status,
      headers: responseHeaders,
    });
    
  } catch (error) {
    console.error('Erreur proxy vidéo:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

export async function HEAD(request, { params }) {
  try {
    const { filename } = params;
    const backendBaseUrl = 'https://jig-projet-1.onrender.com' // FORCE RENDER
    const backendUrl = `${backendBaseUrl}/uploads/${filename}`;
    
    const response = await fetch(backendUrl, {
      method: 'HEAD',
    });
    
    if (!response.ok) {
      return new NextResponse(null, { status: 404 });
    }
    
    const responseHeaders = {
      'Content-Type': response.headers.get('Content-Type') || 'video/mp4',
      'Accept-Ranges': 'bytes',
      'Content-Length': response.headers.get('Content-Length'),
      'Cache-Control': 'public, max-age=31536000',
    };
    
    return new NextResponse(null, {
      status: response.status,
      headers: responseHeaders,
    });
    
  } catch (error) {
    console.error('Erreur HEAD proxy vidéo:', error);
    return new NextResponse(null, { status: 500 });
  }
}