import { useState } from 'react';
import { FiSend } from 'react-icons/fi';
import { appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function VitrineEvent({ restaurant }) {
  const categories = restaurant.menu_categories || [];
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || null);
  const [devis, setDevis] = useState({ item: null, name: '', phone: '', date: '', invite: '', message: '' });
  const [loading, setLoading] = useState(false);

  const openDevis = (item) => setDevis({ item, name: '', phone: '', date: '', invite: '', message: '' });

  const submitDevis = async () => {
    if (!devis.name || !devis.phone) { toast.error('Nom et téléphone requis'); return; }
    setLoading(true);
    try {
      await appointmentAPI.create({
        restaurant_id: restaurant.id,
        type: 'event',
        item_name: devis.item.name,
        client_name: devis.name,
        client_phone: devis.phone,
        preferred_date: devis.date || null,
        guests: devis.invite ? parseInt(devis.invite) : null,
        message: devis.message || null,
      });
      toast.success('Demande de devis envoyée avec succès !');
      setDevis({ item: null, name: '', phone: '', date: '', invite: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  if (!categories.length) {
    return <div className="text-center py-12 text-gray-500"><p>Prestations à venir</p></div>;
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
              {item.image && <img src={item.image} alt="" className="w-full h-36 object-cover" />}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    {item.description && <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>}
                  </div>
                  {item.base_price > 0 && (
                    <span className="text-orange-700 font-bold whitespace-nowrap">À partir de {item.base_price?.toLocaleString()} FCFA</span>
                  )}
                </div>
                <button onClick={() => openDevis(item)} className="btn-primary text-sm px-4 py-2 mt-3 w-full flex items-center justify-center gap-1">
                  <FiSend /> Demander un devis
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {devis.item && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-1">Devis : {devis.item.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{devis.item.base_price > 0 ? `À partir de ${devis.item.base_price?.toLocaleString()} FCFA` : 'Tarif sur demande'}</p>
            <div className="space-y-3">
              <input type="text" placeholder="Votre nom" value={devis.name}
                onChange={e => setDevis({ ...devis, name: e.target.value })} className="input-field" />
              <input type="tel" placeholder="Téléphone" value={devis.phone}
                onChange={e => setDevis({ ...devis, phone: e.target.value })} className="input-field" />
              <div className="grid grid-cols-2 gap-2">
                <input type="date" placeholder="Date de l'événement" value={devis.date}
                  onChange={e => setDevis({ ...devis, date: e.target.value })} className="input-field" />
                <input type="number" placeholder="Nombre d'invités" value={devis.invite}
                  onChange={e => setDevis({ ...devis, invite: e.target.value })} className="input-field" />
              </div>
              <textarea placeholder="Détails de votre projet..." value={devis.message}
                onChange={e => setDevis({ ...devis, message: e.target.value })} className="input-field" rows={3} />
              <div className="flex gap-2">
                <button onClick={submitDevis} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <FiSend />}
                  {loading ? 'Envoi...' : 'Envoyer'}
                </button>
                <button onClick={() => setDevis({ ...devis, item: null })} className="btn-outline flex-1">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
