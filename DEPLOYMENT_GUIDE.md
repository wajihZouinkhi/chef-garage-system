# 🚀 Guide de Déploiement - Chef Garage System

## Variables d'Environnement Requises

### Backend (Railway/Render)
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/vehicle-history-system
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRATION=24h
PORT=3001
RESEND_API_KEY=your-resend-api-key (optionnel pour emails)
FROM_EMAIL=garage@yourdomain.com (optionnel)
APP_URL=https://your-frontend-url.netlify.app
```

### Frontend (Netlify)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

## 📋 Checklist de Déploiement

### ✅ Étape 1: MongoDB Atlas
- [ ] Cluster M0 (gratuit) créé
- [ ] Base de données "vehicle-history-system" créée
- [ ] Utilisateur avec permissions lecture/écriture
- [ ] IP 0.0.0.0/0 autorisée (pour Railway/Render)
- [ ] Connection string récupérée

### ✅ Étape 2: Backend sur Railway
- [ ] Compte Railway créé
- [ ] Repository GitHub connecté
- [ ] Dossier "backend" sélectionné
- [ ] Variables d'environnement ajoutées
- [ ] Déploiement réussi
- [ ] URL backend récupérée

### ✅ Étape 3: Frontend sur Netlify
- [ ] Compte Netlify créé
- [ ] Repository GitHub connecté
- [ ] Build settings configurés
- [ ] Variable NEXT_PUBLIC_API_URL ajoutée
- [ ] Déploiement réussi

## 🔧 Commandes de Test

### Test Backend
```bash
curl https://your-backend-url.railway.app/
```

### Test Frontend
```bash
# Ouvrir dans le navigateur
https://your-app-name.netlify.app
```

## 🚨 Problèmes Courants

### Backend ne démarre pas
- Vérifier MONGODB_URI
- Vérifier JWT_SECRET
- Vérifier les logs Railway

### Frontend ne se connecte pas au Backend
- Vérifier NEXT_PUBLIC_API_URL
- Vérifier CORS dans le backend
- Vérifier les logs réseau (F12)

### Base de données vide
- Créer un utilisateur admin via l'API
- Importer des données de test