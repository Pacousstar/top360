import { useState, useEffect } from 'react';
import { supabase } from '../../services/api';
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
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-500 mt-1">Vue globale de la plateforme TOP 360°</p>
      </div>

      {/* Stats globales */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <FiMapPin className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats?.total_restaurants || 0}</p>
          <p className="text-sm text-gray-500">Restaurants inscrits</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <FiUsers className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats?.total_clients || 0}</p>
          <p className="text-sm text-gray-500">Clients inscrits</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-100 flex items-center justify-center">
              <FiCreditCard className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats?.active_subscriptions || 0}</p>
          <p className="text-sm text-gray-500">Abonnements actifs</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <FiDollarSign className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats?.monthly_revenue?.toLocaleString() || 0}</p>
          <p className="text-sm text-gray-500">Revenus mensuels (FCFA)</p>
        </div>
      </div>

      {/* Second row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-2xl font-bold">{stats?.total_orders || 0}</p>
          <p className="text-sm text-gray-500">Commandes totales</p>
        </div>
        <div className="card p-5">
          <p className="text-2xl font-bold">{stats?.pending_orders || 0}</p>
          <p className="text-sm text-gray-500">Commandes en attente</p>
        </div>
        <div className="card p-5">
          <p className="text-2xl font-bold">
            {stats?.total_restaurants > 0
              ? Math.round((stats?.active_subscriptions / stats?.total_restaurants) * 100)
              : 0}%
          </p>
          <p className="text-sm text-gray-500">Taux d'abonnement</p>
        </div>
      </div>

      {/* Links rapides */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Link to="/admin/restaurants" className="card p-4 text-center hover:bg-green-50">
          <span className="text-2xl block mb-1">🏪</span>
          <span className="text-sm font-medium">Restaurants</span>
        </Link>
        <Link to="/admin/subscriptions" className="card p-4 text-center hover:bg-green-50">
          <span className="text-2xl block mb-1">💳</span>
          <span className="text-sm font-medium">Abonnements</span>
        </Link>
        <Link to="/admin/users" className="card p-4 text-center hover:bg-green-50">
          <span className="text-2xl block mb-1">👥</span>
          <span className="text-sm font-medium">Utilisateurs</span>
        </Link>
      </div>
    </div>
  );
}
