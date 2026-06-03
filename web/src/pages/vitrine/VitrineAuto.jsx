import { useState } from 'react';
import { FiCalendar, FiZap, FiSend } from 'react-icons/fi';
import { appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function VitrineAuto({ restaurant }) {
  const categories = restaurant.menu_categories || [];
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || null);
  const [contact, setContact] = useState({ item: null, name: '', phone: '', date: '', message: '' });
  const [loading, setLoading] = useState(false);

  const openContact = (item) => setContact({ item, name: '', phone: '', date: '', message: `Bonjour, je suis intéressé par ${item.name}.` });

  const submitContact = async () => {
    if (!contact.name || !contact.phone) { toast.error('Nom et téléphone requis'); return; }
    setLoading(true);
    try {
      await appointmentAPI.create({
        restaurant_id: restaurant.id,
        type: 'auto',
        item_name: contact.item.name,
        client_name: contact.name,
        client_phone: contact.phone,
        preferred_date: contact.date || null,
        message: contact.message || null,
      });
      toast.success('Demande envoyée au vendeur !');
      setContact({ item: null, name: '', phone: '', date: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  if (!categories.length) {
    return <div className="text-center py-12 text-gray-500"><p>Annonces à venir</p></div>;
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
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                  {item.cooking_types?.includes('location') && <span className="flex items-center gap-1"><FiCalendar /> Location</span>}
                  {item.cooking_types?.includes('vente') && <span className="flex items-center gap-1"><FiZap /> Vente</span>}
                </div>
                {item.base_price > 0 && (
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xl font-bold text-orange-700">
                      {item.base_price?.toLocaleString()} <span className="text-sm font-normal">FCFA</span>
                    </span>
                    <button onClick={() => openContact(item)} className="btn-primary text-sm px-4 py-2 flex items-center gap-1">
                      <FiSend /> Contacter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {contact.item && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-1">Contact : {contact.item.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{contact.item.base_price?.toLocaleString()} FCFA</p>
            <div className="space-y-3">
              <input type="text" placeholder="Votre nom" value={contact.name}
                onChange={e => setContact({ ...contact, name: e.target.value })} className="input-field" />
              <input type="tel" placeholder="Téléphone" value={contact.phone}
                onChange={e => setContact({ ...contact, phone: e.target.value })} className="input-field" />
              <input type="date" placeholder="Date souhaitée" value={contact.date}
                onChange={e => setContact({ ...contact, date: e.target.value })} className="input-field" />
              <textarea placeholder="Votre message..." value={contact.message}
                onChange={e => setContact({ ...contact, message: e.target.value })} className="input-field" rows={3} />
              <div className="flex gap-2">
                <button onClick={submitContact} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <FiSend />}
                  {loading ? 'Envoi...' : 'Envoyer'}
                </button>
                <button onClick={() => setContact({ ...contact, item: null })} className="btn-outline flex-1">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
