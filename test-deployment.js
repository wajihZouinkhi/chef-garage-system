// Script de test pour vérifier le déploiement
const axios = require('axios');

async function testDeployment() {
    const BACKEND_URL = 'https://your-backend-url.railway.app';
    const FRONTEND_URL = 'https://your-app.netlify.app';
    
    console.log('🧪 Test du déploiement...\n');
    
    try {
        // Test 1: Backend Health Check
        console.log('1️⃣ Test Backend...');
        const backendResponse = await axios.get(`${BACKEND_URL}/`);
        console.log('✅ Backend OK:', backendResponse.status);
        
        // Test 2: Frontend Loading
        console.log('2️⃣ Test Frontend...');
        const frontendResponse = await axios.get(FRONTEND_URL);
        console.log('✅ Frontend OK:', frontendResponse.status);
        
        // Test 3: API Connection
        console.log('3️⃣ Test API Connection...');
        // Note: Ce test nécessitera un token valide
        console.log('⚠️ Test API nécessite une authentification');
        
        console.log('\n🎉 Déploiement réussi!');
        console.log(`🌐 Frontend: ${FRONTEND_URL}`);
        console.log(`🔧 Backend: ${BACKEND_URL}`);
        
    } catch (error) {
        console.error('❌ Erreur de déploiement:', error.message);
        console.log('\n🔍 Vérifiez:');
        console.log('- Variables d\'environnement');
        console.log('- Connection MongoDB');
        console.log('- Configuration CORS');
    }
}

// Remplacez les URLs par vos vraies URLs de déploiement
// testDeployment();