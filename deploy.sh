#!/bin/bash

# 🚀 Script de déploiement Chef Garage System

echo "🚗 Chef Garage System - Déploiement"
echo "=================================="

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ] && [ ! -d "frontend" ] && [ ! -d "backend" ]; then
    echo "❌ Erreur: Exécutez ce script depuis la racine du projet"
    exit 1
fi

echo "📦 Installation des dépendances..."

# Backend
echo "🔧 Backend..."
cd backend
npm install
cd ..

# Frontend  
echo "🎨 Frontend..."
cd frontend
npm install
cd ..

echo "🧪 Tests de build..."

# Test build backend
echo "🔧 Test build backend..."
cd backend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur de build backend"
    exit 1
fi
cd ..

# Test build frontend
echo "🎨 Test build frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur de build frontend"
    exit 1
fi
cd ..

echo "✅ Tous les tests de build sont passés!"
echo ""
echo "🚀 Prêt pour le déploiement:"
echo "1. Commitez vos changements sur GitHub"
echo "2. Déployez le backend sur Railway"
echo "3. Déployez le frontend sur Netlify"
echo ""
echo "📖 Consultez DEPLOYMENT_GUIDE.md pour les détails"