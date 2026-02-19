import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params
    const backendUrl = `https://jig-projet-1.onrender.com/api/projets/video/${filename}`

    
    // Récupérer les headers de range pour le streaming
    const range = request.headers.get('range')
    const headers: HeadersInit = {}
    
    if (range) {
      headers.Range = range
    }
    
    // Faire la requête vers le backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers
    })
    
    if (!response.ok) {
      return new NextResponse('Vidéo non trouvée', { status: 404 })
    }
    
    // Copier les headers de réponse importants
    const responseHeaders = new Headers()
    
    // Headers essentiels pour le streaming vidéo
    if (response.headers.get('content-type')) {
      responseHeaders.set('content-type', response.headers.get('content-type')!)
    }
    if (response.headers.get('content-length')) {
      responseHeaders.set('content-length', response.headers.get('content-length')!)
    }
    if (response.headers.get('content-range')) {
      responseHeaders.set('content-range', response.headers.get('content-range')!)
    }
    if (response.headers.get('accept-ranges')) {
      responseHeaders.set('accept-ranges', response.headers.get('accept-ranges')!)
    }
    
    // Headers CORS
    responseHeaders.set('Access-Control-Allow-Origin', '*')
    responseHeaders.set('Access-Control-Allow-Methods', 'GET')
    responseHeaders.set('Access-Control-Allow-Headers', 'Range')
    
    // Retourner la réponse avec le bon status code
    const status = response.status === 206 ? 206 : 200
    
    return new NextResponse(response.body, {
      status,
      headers: responseHeaders
    })
    
  } catch (error) {
    console.error('Erreur proxy vidéo:', error)
    return new NextResponse('Erreur serveur', { status: 500 })
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Range, Content-Type',
    },
  })
}