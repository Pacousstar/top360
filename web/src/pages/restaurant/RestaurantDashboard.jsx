import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { restaurantAPI, orderAPI } from '../../services/api';
import { FiShoppingBag, FiTrendingUp, FiUsers, FiDollarSign, FiClock, FiEye } from 'react-icons/fi';

export default function RestaurantDashboard() {
  const { restaurant } = useAuth();
  const [stats, setStats] = useState({
    today_orders: 0,
    total_orders: 0,
    today_revenue: 0,
    pending_orders: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (restaurant) {
      loadDashboard();
    }
  }, [restaurant]);

  const loadDashboard = async () => {
    try {
      const ordersRes = await orderAPI.list({ limit: 5 });
      const orders = ordersRes.data.orders || [];
      setRecentOrders(orders);

      const today = new Date().toDateString();
      const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today);
      const pending = orders.filter(o => ['en_attente', 'validee'].includes(o.status));

      setStats({
        today_orders: todayOrders.length,
        total_orders: orders.length,
        today_revenue: todayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
        pending_orders: pending.length,
      });
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  if (!restaurant) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-500 mb-4">Vous n'avez pas encore de restaurant</p>
        <Link to="/register" className="btn-primary">Créer mon restaurant</Link>
      </div>
    );
  }

  const statusColors = {
    en_attente: 'badge-yellow',
    validee: 'badge-blue',
    preparation: 'badge-yellow',
    pret: 'badge-green',
    livree: 'badge-green',
    annulee: 'badge-red',
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">{restaurant.name}</p>
      </div>

      {/* Stats cards - couleurs vives */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="relative bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-5 text-white shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6" />
          <div className="relative">
            <FiShoppingBag className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats.today_orders}</p>
            <p className="text-sm text-orange-100">Commandes aujourd'hui</p>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl p-5 text-white shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6" />
          <div className="relative">
            <FiClock className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats.pending_orders}</p>
            <p className="text-sm text-yellow-100">En attente</p>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl p-5 text-white shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6" />
          <div className="relative">
            <FiDollarSign className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats.today_revenue.toLocaleString()}</p>
            <p className="text-sm text-blue-100">Revenus (FCFA)</p>
          </div>
        </div>
        <div className="relative bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl p-5 text-white shadow-lg overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-6 -mt-6" />
          <div className="relative">
            <FiTrendingUp className="w-6 h-6 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">{stats.total_orders}</p>
            <p className="text-sm text-purple-100">Total commandes</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Link to="/restaurant/menu" className="card p-4 text-center hover:bg-orange-50">
          <span className="text-2xl block mb-1">📋</span>
          <span className="text-sm font-medium">Gérer le menu</span>
        </Link>
        <Link to="/restaurant/orders" className="card p-4 text-center hover:bg-orange-50">
          <span className="text-2xl block mb-1">📦</span>
          <span className="text-sm font-medium">Commandes</span>
        </Link>
        <Link to="/restaurant/stats" className="card p-4 text-center hover:bg-orange-50">
          <span className="text-2xl block mb-1">📊</span>
          <span className="text-sm font-medium">Statistiques</span>
        </Link>
        <Link to="/restaurant/settings" className="card p-4 text-center hover:bg-orange-50">
          <span className="text-2xl block mb-1">⚙️</span>
          <span className="text-sm font-medium">Paramètres</span>
        </Link>
      </div>

      {/* Status toggle */}
      <div className="card p-4 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium">Statut du restaurant</h3>
            <p className="text-sm text-gray-500">Les clients peuvent voir si vous êtes ouvert</p>
          </div>
          <button
            onClick={async () => {
              await restaurantAPI.toggleOpen(restaurant.id);
              loadDashboard();
            }}
            className={`relative w-16 h-8 rounded-full transition-colors ${
              restaurant.is_open ? 'bg-orange-500' : 'bg-gray-300'
            }`}
          >
            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow transition-transform ${
              restaurant.is_open ? 'left-9' : 'left-1'
            }`} />
          </button>
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <h2 className="section-title flex items-center gap-2">
          <FiEye /> Dernières commandes
        </h2>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <Link key={order.id} to={`/restaurant/orders`} className="card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{order.client?.fullname || 'Client'}</p>
                <p className="text-sm text-gray-500">{order.total_amount?.toLocaleString()} FCFA</p>
                <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleString('fr-FR')}</p>
              </div>
              <span className={statusColors[order.status]}>{order.status.replace('_', ' ')}</span>
            </Link>
          ))}
          {recentOrders.length === 0 && (
            <p className="text-center py-8 text-gray-500">Aucune commande pour le moment</p>
          )}
        </div>
      </div>
    </div>
  );
}
