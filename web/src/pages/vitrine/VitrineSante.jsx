import { useState } from 'react';
import { FiCalendar, FiSend } from 'react-icons/fi';
import { appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function VitrineSante({ restaurant }) {
  const categories = restaurant.menu_categories || [];
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || null);
  const [rdv, setRdv] = useState({ item: null, name: '', phone: '', date: '', time: '', motif: '' });
  const [loading, setLoading] = useState(false);

  const openRdv = (item) => setRdv({ item, name: '', phone: '', date: '', time: '', motif: '' });

  const submitRdv = async () => {
    if (!rdv.name || !rdv.phone || !rdv.date) { toast.error('Nom, téléphone et date requis'); return; }
    setLoading(true);
    try {
      await appointmentAPI.create({
        restaurant_id: restaurant.id,
        type: 'sante',
        item_name: rdv.item.name,
        client_name: rdv.name,
        client_phone: rdv.phone,
        preferred_date: rdv.date,
        preferred_time: rdv.time || null,
        motif: rdv.motif || null,
      });
      toast.success('Rendez-vous pris avec succès !');
      setRdv({ item: null, name: '', phone: '', date: '', time: '', motif: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de la réservation');
    } finally {
      setLoading(false);
    }
  };

  if (!categories.length) {
    return <div className="text-center py-12 text-gray-500"><p>Consultations à venir</p></div>;
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
                  <button onClick={() => openRdv(item)} className="btn-primary text-sm px-4 py-2 mt-3 inline-flex items-center gap-1">
                    <FiCalendar /> Prendre rendez-vous
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {rdv.item && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-1">Rendez-vous : {rdv.item.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{rdv.item.base_price?.toLocaleString()} FCFA</p>
            <div className="space-y-3">
              <input type="text" placeholder="Votre nom" value={rdv.name}
                onChange={e => setRdv({ ...rdv, name: e.target.value })} className="input-field" />
              <input type="tel" placeholder="Téléphone" value={rdv.phone}
                onChange={e => setRdv({ ...rdv, phone: e.target.value })} className="input-field" />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={rdv.date}
                  onChange={e => setRdv({ ...rdv, date: e.target.value })} className="input-field" />
                <input type="time" value={rdv.time}
                  onChange={e => setRdv({ ...rdv, time: e.target.value })} className="input-field" />
              </div>
              <textarea placeholder="Motif de la consultation" value={rdv.motif}
                onChange={e => setRdv({ ...rdv, motif: e.target.value })} className="input-field" rows={2} />
              <div className="flex gap-2">
                <button onClick={submitRdv} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <FiSend />}
                  {loading ? 'Envoi...' : 'Confirmer'}
                </button>
                <button onClick={() => setRdv({ ...rdv, item: null })} className="btn-outline flex-1">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
