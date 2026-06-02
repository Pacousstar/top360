import { useState } from 'react';
import { FiCalendar, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function VitrineServices({ restaurant }) {
  const categories = restaurant.menu_categories || [];
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || null);
  const [booking, setBooking] = useState({ item: null, name: '', phone: '', date: '', time: '' });

  const openBooking = (item) => setBooking({ ...booking, item, name: '', phone: '', date: '', time: '' });

  const submitBooking = () => {
    if (!booking.name || !booking.phone) { toast.error('Nom et téléphone requis'); return; }
    toast.success(`Rendez-vous demandé pour ${booking.item.name}`);
    setBooking({ item: null, name: '', phone: '', date: '', time: '' });
  };

  if (!categories.length) {
    return <div className="text-center py-12 text-gray-500"><p>Aucun service disponible</p></div>;
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
            <div key={item.id} className="card p-4">
              <div className="flex items-start gap-4">
                {item.image && <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover" />}
                <div className="flex-1">
                  <h3 className="font-semibold">{item.name}</h3>
                  {item.description && <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>}
                  {item.base_price > 0 && (
                    <p className="text-orange-700 font-bold mt-2">{item.base_price?.toLocaleString()} FCFA</p>
                  )}
                  <button onClick={() => openBooking(item)} className="btn-primary text-sm px-4 py-2 mt-3 inline-flex items-center gap-1">
                    <FiCalendar /> Prendre rendez-vous
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Modal réservation */}
      {booking.item && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-1">Réserver : {booking.item.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{booking.item.base_price?.toLocaleString()} FCFA</p>
            <div className="space-y-3">
              <input type="text" placeholder="Votre nom" value={booking.name}
                onChange={e => setBooking({ ...booking, name: e.target.value })} className="input-field" />
              <input type="tel" placeholder="Téléphone" value={booking.phone}
                onChange={e => setBooking({ ...booking, phone: e.target.value })} className="input-field" />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={booking.date}
                  onChange={e => setBooking({ ...booking, date: e.target.value })} className="input-field" />
                <input type="time" value={booking.time}
                  onChange={e => setBooking({ ...booking, time: e.target.value })} className="input-field" />
              </div>
              <div className="flex gap-2">
                <button onClick={submitBooking} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <FiSend /> Envoyer
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
