import { useState } from 'react';
import { FiCheck, FiSend } from 'react-icons/fi';
import { appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const ROOM_AMENITIES = ['Climatisation', 'Wi-Fi', 'TV', 'Petit-déjeuner', 'Parking', 'Eau chaude'];

export default function VitrineHotel({ restaurant }) {
  const categories = restaurant.menu_categories || [];
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || null);
  const [booking, setBooking] = useState({ item: null, name: '', phone: '', date_debut: '', date_fin: '', guests: 1 });
  const [loading, setLoading] = useState(false);

  const openBooking = (item) => setBooking({ item, name: '', phone: '', date_debut: '', date_fin: '', guests: 1 });

  const submitBooking = async () => {
    if (!booking.name || !booking.phone) { toast.error('Nom et téléphone requis'); return; }
    setLoading(true);
    try {
      await appointmentAPI.create({
        restaurant_id: restaurant.id,
        type: 'hotel',
        item_name: booking.item.name,
        client_name: booking.name,
        client_phone: booking.phone,
        preferred_date: booking.date_debut || null,
        message: booking.date_fin ? `Date de fin: ${booking.date_fin}` : null,
        guests: booking.guests,
      });
      toast.success('Réservation envoyée !');
      setBooking({ item: null, name: '', phone: '', date_debut: '', date_fin: '', guests: 1 });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la réservation');
    } finally {
      setLoading(false);
    }
  };

  if (!categories.length) {
    return <div className="text-center py-12 text-gray-500"><p>Aucune chambre ou service disponible</p></div>;
  }

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2">
        {categories.map(cat => (
          <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedCat === cat.id ? 'bg-orange-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            {cat.name}
          </button>
        ))}
      </div>

      {categories.filter(c => c.id === selectedCat).map(cat => (
        <div key={cat.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cat.menu_items?.map(item => (
            <div key={item.id} className="card overflow-hidden">
              {item.image && <img src={item.image} alt="" className="w-full h-40 object-cover" />}
              <div className="p-4">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {ROOM_AMENITIES.slice(0, 4).map(a => (
                    <span key={a} className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                      <FiCheck className="w-3 h-3" /> {a}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-2xl font-bold text-orange-700">{item.base_price?.toLocaleString()} <span className="text-sm font-normal">FCFA/nuit</span></span>
                  <button onClick={() => openBooking(item)} className="btn-primary text-sm px-4 py-2">Réserver</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {booking.item && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-1">Réservation : {booking.item.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{booking.item.base_price?.toLocaleString()} FCFA/nuit</p>
            <div className="space-y-3">
              <input type="text" placeholder="Votre nom" value={booking.name}
                onChange={e => setBooking({ ...booking, name: e.target.value })} className="input-field" />
              <input type="tel" placeholder="Téléphone" value={booking.phone}
                onChange={e => setBooking({ ...booking, phone: e.target.value })} className="input-field" />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Arrivée</label>
                  <input type="date" value={booking.date_debut}
                    onChange={e => setBooking({ ...booking, date_debut: e.target.value })} className="input-field" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Départ</label>
                  <input type="date" value={booking.date_fin}
                    onChange={e => setBooking({ ...booking, date_fin: e.target.value })} className="input-field" />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Voyageurs</label>
                <input type="number" min="1" value={booking.guests}
                  onChange={e => setBooking({ ...booking, guests: parseInt(e.target.value) || 1 })} className="input-field" />
              </div>
              <div className="flex gap-2">
                <button onClick={submitBooking} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <FiSend />}
                  {loading ? 'Envoi...' : 'Envoyer ma demande'}
                </button>
                <button onClick={() => setBooking({ ...booking, item: null })} className="btn-outline flex-1">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
