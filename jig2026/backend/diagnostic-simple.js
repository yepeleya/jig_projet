// Diagnostic simple pour identifier l'erreur 500
fetch('https://jig-projet-1.onrender.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@invalid.com', password: 'wrong' })
})
.then(response => response.text())
.then(text => {
  console.log('📧 Réponse brute:', text)
  try {
    const json = JSON.parse(text)
    console.log('📋 Erreur:', json.message)
  } catch (e) {
    console.log('❌ Erreur de parsing JSON')
  }
})
.catch(error => console.error('❌ Erreur requête:', error))