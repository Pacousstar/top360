import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiSearch, FiTrendingUp, FiClock, FiStar, FiChevronRight } from 'react-icons/fi';
import { restaurantAPI } from '../services/api';

const MODULES = [
  { key: 'top_delice', name: 'TOP DÉLICE', icon: '🍽️', desc: 'Restaurants, maquis, bars', color: 'from-orange-500 to-red-500' },
  { key: 'top_bat', name: 'TOP BAT', icon: '🏗️', desc: 'BTP & quincailleries', color: 'from-blue-500 to-blue-700' },
  { key: 'top_hotel', name: 'TOP HOTEL', icon: '🏨', desc: 'Hôtels & tourisme', color: 'from-purple-500 to-purple-700' },
  { key: 'top_shop', name: 'TOP SHOP', icon: '🛍️', desc: 'Commerces & boutiques', color: 'from-pink-500 to-rose-600' },
  { key: 'top_auto', name: 'TOP AUTO', icon: '🚗', desc: 'Automobile', color: 'from-cyan-500 to-cyan-700' },
  { key: 'top_services', name: 'TOP SERVICES', icon: '⚖️', desc: 'Prestataires & services', color: 'from-amber-500 to-amber-700' },
];

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const [allRes, featuredRes] = await Promise.all([
        restaurantAPI.list({ limit: 12 }),
        restaurantAPI.list({ is_featured: 'true', limit: 6 }),
      ]);
      setRestaurants(allRes.data.restaurants || []);
      setFeatured(featuredRes.data.restaurants || []);
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 via-orange-500 to-red-500 text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-orange-300 rounded-full blur-3xl opacity-30" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-yellow-300 rounded-full blur-3xl opacity-20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white rounded-full blur-[100px] opacity-5" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Bienvenue sur <span className="text-yellow-300">TOP 360°</span>
            </h1>
            <p className="text-lg sm:text-xl text-orange-100 mb-8">
              La plateforme digitale des commerces et services locaux
            </p>
            <div className="relative max-w-lg mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Que cherchez-vous ? (restaurant, quincaillerie, hôtel...)"
                className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 bg-white shadow-lg focus:ring-2 focus:ring-orange-400 outline-none text-base"
              />
            </div>
            <Link to="/map" className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-yellow-400 text-orange-900 font-bold rounded-xl hover:bg-yellow-300 transition-all hover:scale-105 shadow-lg">
              <FiMapPin className="w-5 h-5" />
              Explorer la carte interactive
            </Link>
          </div>
        </div>
      </section>

      {/* Modules rapides */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {MODULES.map((mod) => (
            <Link
              key={mod.key}
              to={`/search?module=${mod.key}`}
              className={`bg-white rounded-xl shadow-md border p-4 text-center hover:shadow-lg transition-all hover:-translate-y-1`}
            >
              <span className="text-2xl block mb-1">{mod.icon}</span>
              <span className="text-sm font-semibold text-gray-800">{mod.name}</span>
              <span className="text-xs text-gray-500 block mt-0.5">{mod.desc}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Restaurants sponsorisés */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiStar className="text-yellow-500" /> Mis en avant
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((r) => (
              <Link key={r.id} to={`/restaurant/${r.slug}`} className="card group">
                <div className="h-40 bg-gradient-to-br from-orange-500 to-red-500 relative overflow-hidden">
                  {r.banner && <img src={r.banner} alt="" className="w-full h-full object-cover" />}
                  <div className="absolute top-3 right-3">
                    <span className="badge bg-yellow-400 text-yellow-900">⭐ Sponsorisé</span>
                  </div>
                  {r.is_open && (
                    <div className="absolute top-3 left-3">
                      <span className="badge-green">🟢 Ouvert</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-xl flex-shrink-0">
                      {r.logo ? <img src={r.logo} alt="" className="w-full h-full rounded-xl object-cover" /> : '🍽️'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{r.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{r.city || r.description}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                        <span>{r.avg_rating > 0 ? `⭐ ${r.avg_rating}` : 'Nouveau'}</span>
                        <span>•</span>
                        <span>{r.module?.replace('top_', '').toUpperCase()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Tous les restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiTrendingUp /> Découvrir
          </h2>
          <Link to="/search" className="text-orange-700 hover:text-orange-800 font-medium text-sm flex items-center gap-1">
            Voir tout <FiChevronRight />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-40 bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {restaurants.map((r) => (
              <Link key={r.id} to={`/restaurant/${r.slug}`} className="card group">
                <div className="h-40 bg-gradient-to-br from-orange-500 to-red-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  {r.is_open ? (
                    <span className="absolute top-3 left-3 badge-green">🟢 Ouvert</span>
                  ) : (
                    <span className="absolute top-3 left-3 badge-red">🔴 Fermé</span>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                      {r.logo ? <img src={r.logo} alt="" className="w-full h-full rounded-xl object-cover" /> : '🏪'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{r.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{r.city || r.description || r.module?.replace('top_', '').toUpperCase()}</p>
                      <div className="flex items-center gap-2 mt-1 text-sm">
                        {r.avg_rating > 0 ? (
                          <span className="text-yellow-600">⭐ {r.avg_rating}</span>
                        ) : (
                          <span className="text-gray-400">Nouveau</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!loading && restaurants.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-xl mb-2">Aucun commerce pour le moment</p>
            <p>Soyez le premier à vous inscrire !</p>
          </div>
        )}
      </section>

      {/* CTA Inscription */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl opacity-20" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Vous êtes un commerce ou un prestataire ?</h2>
          <p className="text-orange-100 mb-8 max-w-2xl mx-auto">
            Créez votre vitrine numérique, gérez vos commandes, et faites-vous connaître des milliers de clients.
          </p>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-orange-700 font-bold text-lg rounded-xl hover:bg-orange-50 transition-all hover:scale-105 shadow-lg">
            Créer ma vitrine gratuitement
          </Link>
        </div>
      </section>
    </div>
  );
}
