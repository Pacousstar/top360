import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderAPI } from '../../services/api';
import { FiArrowLeft } from 'react-icons/fi';

export default function ClientOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const res = await orderAPI.get(id);
      setOrder(res.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-green-500 border-t-transparent mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Commande non trouvée</p>
        <Link to="/client/orders" className="text-green-700 mt-2 inline-block">Mes commandes</Link>
      </div>
    );
  }

  const statusSteps = ['en_attente', 'validee', 'preparation', 'pret', 'livree'];
  const currentStep = statusSteps.indexOf(order.status);

  return (
    <div>
      <Link to="/client/orders" className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 mb-4">
        <FiArrowLeft /> Mes commandes
      </Link>

      <h1 className="text-2xl font-bold mb-2">Détail de la commande</h1>
      <p className="text-gray-500 mb-6">{order.restaurant?.name}</p>

      {/* Suivi */}
      <div className="card p-6 mb-6">
        <h2 className="font-semibold mb-4">Suivi de commande</h2>
        <div className="flex items-center justify-between">
          {statusSteps.map((step, index) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                index <= currentStep ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                {index + 1}
              </div>
              <span className="text-xs mt-1 text-center capitalize">{step.replace('_', ' ')}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Infos */}
      <div className="card p-6 space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Statut</span>
          <span className="font-medium capitalize">{order.status?.replace('_', ' ')}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Total</span>
          <span className="font-bold text-green-700">{order.total_amount?.toLocaleString()} FCFA</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Avance payée</span>
          <span className="font-medium text-green-600">{order.deposit_amount?.toLocaleString()} FCFA</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Reste à payer</span>
          <span className="font-medium">{order.remaining_amount?.toLocaleString()} FCFA</span>
        </div>
        {order.pickup_time && (
          <div className="flex justify-between">
            <span className="text-gray-500">Heure de retrait</span>
            <span className="font-medium">{new Date(order.pickup_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
        {order.notes && (
          <div>
            <span className="text-gray-500 block mb-1">Notes</span>
            <p className="text-gray-700">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
