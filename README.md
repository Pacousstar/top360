# 🏪 TOP 360°

## *La plateforme digitale des commerces et services locaux*

---

### 🎯 Vision

**TOP 360°** est une plateforme SaaS multi-secteurs qui permet à **TOUT commerce ou prestataire de service** d'obtenir :
- Une **vitrine numérique professionnelle**
- Des **outils de gestion** (statistiques, commandes, réservations)
- De la **visibilité géolocalisée** sur une carte interactive
- Un **accès à des clients** via un compte unique

### 🚀 Modules

| Module | Secteur |
|--------|---------|
| 🍽️ TOP DÉLICE | Restauration, maquis, bars |
| 🏗️ TOP BAT | BTP & quincailleries |
| 🏨 TOP HOTEL | Hôtellerie & tourisme |
| 🛍️ TOP SHOP | Commerce général |
| 🚗 TOP AUTO | Automobile |
| 🏥 TOP SANTÉ | Santé |
| 🎓 TOP ÉDUCATION | Éducation |
| 🏠 TOP IMMO | Immobilier |
| 🎉 TOP EVENT | Événementiel |
| ⚖️ TOP SERVICES | Prestataires de services |

### 👥 Acteurs

| Rôle | Description |
|------|-------------|
| **👤 Client** | Explore, commande, réserve, paie, suit |
| **🏪 Structure** | Vitrine, dashboard, catalogue, commandes, stats |
| **👑 Super Admin** | Dashboard global, gestion, modération |

### 💰 Business Model

- **Abonnements** : Starter (3k FCFA) / Business (7.5k) / Premium (15k)
- **Sponsoring** : Mise en avant sur la carte et les résultats
- **Publicité** : Bannières et annonces sponsorisées
- **Commissions** : Sur ventes et réservations (2-5%)

### 🛠️ Stack Technique

| Frontend | Backend | Database | Mobile |
|----------|---------|----------|--------|
| React + Vite | Node.js + Express | Supabase PostgreSQL | React Native / Expo |
| Tailwind CSS | JWT Auth | Realtime | PWA |
| Leaflet/Mapbox | REST API | Storage | |

---

## 🚀 Déploiement

### Prérequis
- Node.js 20+
- Compte Supabase (gratuit)
- Compte Vercel (gratuit)
- Compte GitHub

### Installation

```bash
# Cloner le projet
git clone https://github.com/Pacousstar/top360.git
cd top360

# Installer les dépendances
cd server && npm install
cd ../web && npm install
cd ..

# Configurer les variables d'environnement
cp server/.env.example server/.env
cp web/.env.example web/.env

# Lancer en développement
npm run dev
```

---

*Construit avec ❤️ en Côte d'Ivoire 🇨🇮*
