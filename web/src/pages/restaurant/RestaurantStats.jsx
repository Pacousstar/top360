import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { orderAPI } from '../../services/api';

export default function RestaurantStats() {
  const { restaurant } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurant) loadStats();
  }, [restaurant]);

  const loadStats = async () => {
    try {
      const res = await orderAPI.list({ limit: 200 });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'livree').length;

  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Statistiques</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="card p-5">
          <p className="text-sm text-gray-500">Total commandes</p>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Commandes aujourd'hui</p>
          <p className="text-3xl font-bold">{todayOrders.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Revenu total</p>
          <p className="text-3xl font-bold text-orange-700">{totalRevenue.toLocaleString()} FCFA</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500">Revenu aujourd'hui</p>
          <p className="text-3xl font-bold text-orange-700">{todayRevenue.toLocaleString()} FCFA</p>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="font-semibold mb-3">Vue d'ensemble</h2>
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-2xl font-bold text-blue-700">{completedOrders}</p>
            <p className="text-sm text-blue-600">Commandes terminées</p>
          </div>
          <div className="p-4 bg-orange-50 rounded-xl">
            <p className="text-2xl font-bold text-orange-700">{orders.filter(o => ['en_attente', 'validee', 'preparation', 'pret'].includes(o.status)).length}</p>
            <p className="text-sm text-orange-600">Commandes en cours</p>
          </div>
        </div>
      </div>
    </div>
  );
}
