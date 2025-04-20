const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Lire les données de test
const dataPath = path.join(__dirname, 'test-data.json');
const testData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Configuration de l'API Strapi
const API_URL = 'http://localhost:1337/api';
const ADMIN_TOKEN = 'cc5b00ff3823cffa29ec998d9d68191a52d01b3e19344eb937c22392a85935fab50a5887dd4926de5a3aedf903441e9a803fdd29a31a0543483e38fa45b6ead54a11b420e681010a2446463d67dce036dfd2adaa58a794462cbec67ad452df9846dbce2486b5c32ae474835e01cb5f612f18f4fd54504cdc17c8c05c8acc082f';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${ADMIN_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

async function importData() {
  try {
    // 1. Créer les catégories
    console.log('Création des catégories...');
    const categories = {};
    for (const category of testData.categories) {
      try {
        const response = await axiosInstance.post('/categories', {
          data: category
        });
        categories[category.name] = response.data.data.id;
        console.log(`Catégorie créée: ${category.name}`);
      } catch (error) {
        console.error(`Erreur lors de la création de la catégorie ${category.name}:`, error.response?.data || error.message);
      }
    }

    // 2. Créer les utilisateurs
    console.log('\nCréation des utilisateurs...');
    const users = {};
    for (const user of testData.users) {
      try {
        const response = await axios.post('http://localhost:1337/api/auth/local/register', {
          username: user.username,
          email: user.email,
          password: user.password
        });
        users[user.username] = response.data.user.id;
        console.log(`Utilisateur créé: ${user.username}`);
      } catch (error) {
        console.error(`Erreur lors de la création de l'utilisateur ${user.username}:`, error.response?.data || error.message);
      }
    }

    // 3. Créer les souvenirs
    console.log('\nCréation des souvenirs...');
    for (const memory of testData.memories) {
      try {
        const response = await axiosInstance.post('/memories', {
          data: {
            ...memory,
            category: categories[memory.category],
            user: users[Object.keys(users)[Math.floor(Math.random() * Object.keys(users).length)]]
          }
        });
        console.log(`Souvenir créé: ${memory.title}`);
      } catch (error) {
        console.error(`Erreur lors de la création du souvenir ${memory.title}:`, error.response?.data || error.message);
      }
    }

    console.log('\nImportation terminée avec succès !');
  } catch (error) {
    console.error('Erreur lors de l\'importation:', error.response?.data || error.message);
  }
}

importData(); 