import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';

export default function ClientOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await orderAPI.list({ limit: 20 });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = {
    en_attente: 'text-yellow-600 bg-yellow-50',
    validee: 'text-blue-600 bg-blue-50',
    preparation: 'text-yellow-600 bg-yellow-50',
    pret: 'text-orange-600 bg-orange-50',
    livree: 'text-orange-700 bg-orange-100',
    annulee: 'text-red-600 bg-red-50',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Mes commandes</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mx-auto" />
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <Link key={order.id} to={`/client/orders/${order.id}`} className="card p-4 block">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold">{order.restaurant?.name || 'Restaurant'}</p>
                  <p className="text-sm text-gray-500">{order.total_amount?.toLocaleString()} FCFA</p>
                </div>
                <span className={`px-3 py-1 rounded-lg text-xs font-medium ${statusColors[order.status]}`}>
                  {order.status?.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{new Date(order.created_at).toLocaleString('fr-FR')}</span>
                <span>Avance: {order.deposit_amount?.toLocaleString()} FCFA</span>
              </div>
            </Link>
          ))}
          {orders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">Aucune commande</p>
              <Link to="/" className="text-orange-700 font-medium">Découvrir les restaurants</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
