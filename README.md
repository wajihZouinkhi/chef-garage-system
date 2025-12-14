# 🚗 Chef Garage System

Un système de gestion d'historique de maintenance pour garage automobile, développé avec Next.js et NestJS.

## 📋 Fonctionnalités

- ✅ **Gestion des véhicules** - Ajouter, modifier, supprimer des véhicules
- ✅ **Historique de maintenance** - Suivi complet des réparations et entretiens
- ✅ **Gestion du personnel** - Organisation des mécaniciens par spécialité
- ✅ **Authentification** - Système de connexion sécurisé
- ✅ **Interface responsive** - Compatible mobile et desktop
- ✅ **Recherche avancée** - Filtrage des enregistrements de maintenance
- ✅ **Photos** - Support des images pour les réparations

## 🛠 Technologies

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling
- **Lucide React** - Icônes
- **Axios** - Requêtes HTTP

### Backend
- **NestJS** - Framework Node.js
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **bcrypt** - Hachage des mots de passe

## 🚀 Déploiement

### Prérequis
- Node.js 18+
- MongoDB Atlas (gratuit)
- Compte GitHub

### Variables d'environnement

#### Backend
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vehicle-history-system
JWT_SECRET=your-super-secret-key
JWT_EXPIRATION=24h
PORT=3001
```

#### Frontend
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

### Déploiement gratuit

1. **Backend sur Railway** (gratuit - 500h/mois)
2. **Frontend sur Netlify** (gratuit - 100GB/mois)
3. **Base de données MongoDB Atlas** (gratuit - 512MB)

## 📦 Installation locale

### 1. Cloner le repository
```bash
git clone https://github.com/votre-username/chef-garage-system.git
cd chef-garage-system
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurer les variables d'environnement
npm run start:dev
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Configurer NEXT_PUBLIC_API_URL
npm run dev
```

## 🎯 Utilisation

1. **Créer un compte administrateur**
2. **Ajouter des véhicules** dans le système
3. **Enregistrer le personnel** du garage
4. **Saisir les maintenances** avec photos et détails
5. **Consulter l'historique** par véhicule

## 📊 Limites gratuites

- **Utilisateurs simultanés** : 2-3 (parfait pour un garage)
- **Stockage** : 512MB (suffisant pour des milliers d'enregistrements)
- **Bande passante** : 100GB/mois (largement suffisant)
- **Temps de fonctionnement** : 500h/mois (couvre un usage normal)

## 🔧 Scripts disponibles

### Backend
```bash
npm run build          # Compiler le projet
npm run start:dev       # Développement avec hot-reload
npm run start:prod      # Production
npm run test           # Tests unitaires
```

### Frontend
```bash
npm run dev            # Serveur de développement
npm run build          # Build de production
npm run start          # Serveur de production
npm run lint           # Vérification du code
```

## 📝 Structure du projet

```
chef-garage-system/
├── backend/           # API NestJS
│   ├── src/
│   │   ├── auth/      # Authentification
│   │   ├── users/     # Gestion utilisateurs
│   │   ├── vehicles/  # Gestion véhicules
│   │   ├── maintenance/ # Historique maintenance
│   │   └── staff/     # Gestion personnel
│   └── package.json
├── frontend/          # Interface Next.js
│   ├── app/           # Pages et routing
│   ├── components/    # Composants réutilisables
│   └── lib/           # Utilitaires
└── README.md
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit les changements (`git commit -m 'Ajouter nouvelle fonctionnalité'`)
4. Push vers la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation de déploiement dans `DEPLOYMENT_GUIDE.md`

---

**Développé avec ❤️ pour les garages automobiles**