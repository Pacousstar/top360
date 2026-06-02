import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { Link } from 'react-router-dom';
import { FiUsers, FiShoppingBag, FiCreditCard, FiTrendingUp, FiMapPin, FiDollarSign } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await adminAPI.dashboard();
      setStats(res.data.stats);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-500 mt-1">Vue globale de la plateforme TOP 360°</p>
      </div>

      {/* Stats globales — couleurs vives */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="relative bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
          <div className="relative">
            <FiMapPin className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats?.total_restaurants || 0}</p>
            <p className="text-sm text-orange-100">Restaurants inscrits</p>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-5 text-white shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
          <div className="relative">
            <FiUsers className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats?.total_clients || 0}</p>
            <p className="text-sm text-blue-100">Clients inscrits</p>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-5 text-white shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
          <div className="relative">
            <FiCreditCard className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats?.active_subscriptions || 0}</p>
            <p className="text-sm text-yellow-100">Abonnements actifs</p>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-5 text-white shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8" />
          <div className="relative">
            <FiDollarSign className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats?.monthly_revenue?.toLocaleString() || 0}</p>
            <p className="text-sm text-purple-100">Revenus mensuels (FCFA)</p>
          </div>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="relative bg-gradient-to-br from-cyan-500 to-cyan-700 rounded-2xl p-5 text-white shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6" />
          <div className="relative">
            <p className="text-3xl font-bold mb-1">{stats?.total_orders || 0}</p>
            <p className="text-sm text-cyan-100">Commandes totales</p>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl p-5 text-white shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6" />
          <div className="relative">
            <p className="text-3xl font-bold mb-1">{stats?.pending_orders || 0}</p>
            <p className="text-sm text-pink-100">Commandes en attente</p>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl p-5 text-white shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6" />
          <div className="relative">
            <p className="text-3xl font-bold mb-1">
              {stats?.total_restaurants > 0
                ? Math.round((stats?.active_subscriptions / stats?.total_restaurants) * 100)
                : 0}%
            </p>
            <p className="text-sm text-emerald-100">Taux d'abonnement</p>
          </div>
        </div>
      </div>

      {/* Links rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/admin/restaurants" className="card p-4 text-center hover:bg-orange-50">
          <span className="text-2xl block mb-1">🏪</span>
          <span className="text-sm font-medium">Restaurants</span>
        </Link>
        <Link to="/admin/subscriptions" className="card p-4 text-center hover:bg-orange-50">
          <span className="text-2xl block mb-1">💳</span>
          <span className="text-sm font-medium">Abonnements</span>
        </Link>
        <Link to="/admin/users" className="card p-4 text-center hover:bg-orange-50">
          <span className="text-2xl block mb-1">👥</span>
          <span className="text-sm font-medium">Utilisateurs</span>
        </Link>
      </div>
    </div>
  );
}
