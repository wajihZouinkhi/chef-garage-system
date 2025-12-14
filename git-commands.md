# 📝 Commandes Git pour GitHub

## 🚀 Première fois (nouveau repository)

```bash
# 1. Initialiser Git (si pas déjà fait)
git init

# 2. Ajouter tous les fichiers
git add .

# 3. Premier commit
git commit -m "🚗 Initial commit - Chef Garage System

✨ Features:
- Vehicle management system
- Maintenance history tracking
- Staff management
- Authentication system
- Responsive UI with Tailwind CSS
- MongoDB integration
- Ready for deployment on Railway + Netlify

🛠 Tech Stack:
- Frontend: Next.js 14 + TypeScript + Tailwind
- Backend: NestJS + MongoDB + JWT
- Deployment: Railway (backend) + Netlify (frontend)"

# 4. Ajouter le remote GitHub (remplacez par votre URL)
git remote add origin https://github.com/VOTRE-USERNAME/chef-garage-system.git

# 5. Push vers GitHub
git push -u origin main
```

## 🔄 Commits suivants

```bash
# Ajouter les changements
git add .

# Commit avec message descriptif
git commit -m "✨ Add new feature or 🐛 Fix bug description"

# Push vers GitHub
git push
```

## 📋 Messages de commit recommandés

- `✨ Add: nouvelle fonctionnalité`
- `🐛 Fix: correction de bug`
- `📝 Docs: mise à jour documentation`
- `🎨 Style: améliorations UI/UX`
- `♻️ Refactor: restructuration du code`
- `🚀 Deploy: préparation déploiement`
- `🔧 Config: configuration`
- `🧪 Test: ajout de tests`

## ⚠️ Avant de commiter

Vérifiez que ces fichiers sont bien exclus (.gitignore) :
- ❌ `backend/.env` (contient des secrets)
- ❌ `frontend/.env.local`
- ❌ `node_modules/`
- ❌ `.next/`
- ❌ `dist/`

## 🔐 Sécurité

- ✅ Fichiers .env dans .gitignore
- ✅ Secrets dans variables d'environnement
- ✅ JWT_SECRET changé pour la production
- ✅ MongoDB credentials sécurisées