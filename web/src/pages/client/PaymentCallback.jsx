import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { paymentAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiCheckCircle, FiXCircle, FiArrowRight } from 'react-icons/fi';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading');
  const [orderId, setOrderId] = useState(null);

  useEffect(() => {
    const orderIdParam = searchParams.get('order_id');
    const statusParam = searchParams.get('status');
    const sessionId = searchParams.get('session_id');

    setOrderId(orderIdParam);

    if (!orderIdParam) {
      setStatus('error');
      return;
    }

    if (statusParam === 'success') {
      confirmPayment(orderIdParam, sessionId);
    } else {
      setStatus('cancelled');
    }
  }, []);

  const confirmPayment = async (orderId, sessionId) => {
    try {
      await paymentAPI.confirm(orderId, sessionId);
      setStatus('success');
      toast.success('Paiement confirmé !');
    } catch (error) {
      setStatus('error');
      toast.error('Erreur de confirmation');
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      {status === 'success' ? (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiCheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-green-700 mb-2">Paiement réussi !</h2>
          <p className="text-gray-500 mb-6">
            Votre avance a bien été reçue. Le restaurateur a été notifié.
          </p>
          <Link
            to={`/client/orders/${orderId}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            Voir ma commande <FiArrowRight />
          </Link>
        </div>
      ) : status === 'cancelled' ? (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiXCircle className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-yellow-700 mb-2">Paiement annulé</h2>
          <p className="text-gray-500 mb-6">
            Vous avez annulé le paiement. Vous pouvez réessayer depuis votre espace client.
          </p>
          <Link
            to={`/client/orders`}
            className="btn-primary inline-flex items-center gap-2"
          >
            Mes commandes <FiArrowRight />
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiXCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-red-700 mb-2">Erreur de paiement</h2>
          <p className="text-gray-500 mb-6">
            Une erreur est survenue. Contactez le support si le problème persiste.
          </p>
          <Link
            to={`/client/orders`}
            className="btn-primary inline-flex items-center gap-2"
          >
            Mes commandes <FiArrowRight />
          </Link>
        </div>
      )}
    </div>
  );
}
