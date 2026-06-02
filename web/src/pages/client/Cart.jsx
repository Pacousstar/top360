import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiCheck } from 'react-icons/fi';

export default function Cart() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const data = location.state;

  const [pickupTime, setPickupTime] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  if (!data) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-xl text-gray-500 mb-4">Panier vide</p>
        <Link to="/" className="btn-primary">Retour à l'accueil</Link>
      </div>
    );
  }

  const { restaurant, cart, cartTotal } = data;
  const depositAmount = Math.round(cartTotal * 0.3);
  const remainingAmount = cartTotal - depositAmount;

  const handleOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        restaurant_id: restaurant.id,
        items: cart.map(item => ({
          menu_item_id: item.id,
          quantity: item.quantity,
          unit_price: item.base_price,
          cooking_type: item.cooking_type,
          spice_level: item.spice_level,
          accompaniment: item.accompaniment,
          notes: item.notes,
        })),
        pickup_time: pickupTime || null,
        notes: notes || null,
        deposit_amount: depositAmount,
      };

      const res = await orderAPI.create(orderData);
      toast.success('Commande créée avec succès !');
      navigate('/client/orders');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la commande');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <Link to={`/restaurant/${restaurant.slug}`} className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-700 mb-4">
        <FiArrowLeft /> Retour au menu
      </Link>

      <h1 className="text-2xl font-bold mb-2">Votre commande</h1>
      <p className="text-gray-500 mb-6">{restaurant.name}</p>

      {/* Récapitulatif */}
      <div className="space-y-3 mb-6">
        {cart.map((item) => (
          <div key={item.id} className="card p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">x{item.quantity}</p>
            </div>
            <span className="font-semibold">{(item.base_price * item.quantity).toLocaleString()} FCFA</span>
          </div>
        ))}
      </div>

      {/* Options */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Heure de retrait souhaitée</label>
          <input
            type="time"
            value={pickupTime}
            onChange={(e) => setPickupTime(e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optionnel)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-field"
            rows={3}
            placeholder="Précisions pour le restaurateur..."
          />
        </div>
      </div>

      {/* Paiement */}
      <div className="card p-4 mb-6">
        <h3 className="font-semibold mb-3">Récapitulatif paiement</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Total commande</span>
            <span className="font-medium">{cartTotal.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between text-orange-600">
            <span>Avance obligatoire (30%)</span>
            <span className="font-bold">{depositAmount.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>Reste à payer au retrait</span>
            <span>{remainingAmount.toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleOrder}
        disabled={loading}
        className="btn-primary w-full flex items-center justify-center gap-2 py-4 text-lg"
      >
        {loading ? (
          <>
            <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            Commande en cours...
          </>
        ) : (
          <>
            <FiCheck className="w-5 h-5" />
            Confirmer la commande ({depositAmount.toLocaleString()} FCFA d'avance)
          </>
        )}
      </button>
    </div>
  );
}
