import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';

const STATUS_FLOW = ['en_attente', 'validee', 'preparation', 'pret', 'livree'];
const STATUS_LABELS = {
  en_attente: 'En attente',
  validee: 'Validée',
  preparation: 'En préparation',
  pret: 'Prête',
  livree: 'Livrée / Retirée',
  annulee: 'Annulée',
};

export default function RestaurantOrders() {
  const { restaurant } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurant) loadOrders();
  }, [restaurant]);

  const loadOrders = async () => {
    try {
      const res = await orderAPI.list({ limit: 50 });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId, currentStatus) => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    const nextStatus = currentIndex < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentIndex + 1] : 'livree';

    try {
      await orderAPI.updateStatus(orderId, nextStatus);
      loadOrders();
      toast.success(`Commande ${STATUS_LABELS[nextStatus].toLowerCase()}`);
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const cancelOrder = async (orderId) => {
    try {
      await orderAPI.updateStatus(orderId, 'annulee');
      loadOrders();
      toast.success('Commande annulée');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const filteredOrders = filter === 'all' ? orders : orders.filter(o => o.status === filter);
  const pendingCount = orders.filter(o => o.status === 'en_attente').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Commandes {pendingCount > 0 && <span className="badge-red ml-2">{pendingCount} en attente</span>}</h1>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium ${filter === 'all' ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'}`}
        >
          Toutes
        </button>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium ${filter === key ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent mx-auto" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold">{order.client?.fullname || 'Client'}</p>
                  <p className="text-sm text-gray-500">{order.client?.phone}</p>
                  <p className="text-sm text-gray-400">{new Date(order.created_at).toLocaleString('fr-FR')}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-700">{order.total_amount?.toLocaleString()} FCFA</p>
                  <p className="text-xs text-gray-400">{order.payment_status?.replace('_', ' ')}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-1 mb-3">
                {order.order_items?.map(item => (
                  <p key={item.id} className="text-sm text-gray-600">
                    x{item.quantity} {item.menu_item?.name || 'Plat'}
                  </p>
                ))}
              </div>

              {order.notes && (
                <p className="text-sm text-gray-500 italic mb-2">📝 {order.notes}</p>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between">
                <span className={`badge ${
                  order.status === 'en_attente' ? 'badge-yellow' :
                  order.status === 'validee' ? 'badge-blue' :
                  order.status === 'preparation' ? 'badge-yellow' :
                  order.status === 'pret' ? 'badge-green' :
                  order.status === 'livree' ? 'badge-green' : 'badge-red'
                }`}>
                  {STATUS_LABELS[order.status]}
                </span>
                <div className="flex gap-2">
                  {order.status === 'en_attente' && (
                    <button onClick={() => cancelOrder(order.id)} className="btn-danger text-xs px-3 py-1.5">
                      Annuler
                    </button>
                  )}
                  {!['livree', 'annulee'].includes(order.status) && (
                    <button onClick={() => updateStatus(order.id, order.status)} className="btn-primary text-xs px-3 py-1.5">
                      {order.status === 'pret' ? 'Marquer retirée' : 'Passer à ' + STATUS_LABELS[STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]]?.toLowerCase()}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filteredOrders.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Aucune commande</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
