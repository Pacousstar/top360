import { useState } from 'react';
import { FiMapPin, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function VitrineImmo({ restaurant }) {
  const categories = restaurant.menu_categories || [];
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || null);
  const [contact, setContact] = useState({ item: null, name: '', phone: '', message: '' });

  const openContact = (item) => setContact({ item, name: '', phone: '', message: `Bonjour, je suis intéressé par ${item.name}. Merci de me contacter.` });

  const submitContact = () => {
    if (!contact.name || !contact.phone) { toast.error('Nom et téléphone requis'); return; }
    toast.success(`Demande envoyée pour ${contact.item.name}`);
    setContact({ item: null, name: '', phone: '', message: '' });
  };

  if (!categories.length) {
    return <div className="text-center py-12 text-gray-500"><p>Aucun bien disponible</p></div>;
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
                  {item.accompaniments?.includes('visite') && <span className="flex items-center gap-1"><FiMapPin /> Visite possible</span>}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xl font-bold text-orange-700">
                    {item.base_price?.toLocaleString()} <span className="text-sm font-normal">FCFA</span>
                  </span>
                  <button onClick={() => openContact(item)} className="btn-primary text-sm px-4 py-2 flex items-center gap-1">
                    <FiSend /> Contacter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}

      {contact.item && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-1">Intéressé par : {contact.item.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{contact.item.base_price?.toLocaleString()} FCFA</p>
            <div className="space-y-3">
              <input type="text" placeholder="Votre nom" value={contact.name}
                onChange={e => setContact({ ...contact, name: e.target.value })} className="input-field" />
              <input type="tel" placeholder="Téléphone" value={contact.phone}
                onChange={e => setContact({ ...contact, phone: e.target.value })} className="input-field" />
              <textarea placeholder="Message" value={contact.message}
                onChange={e => setContact({ ...contact, message: e.target.value })} className="input-field" rows={3} />
              <div className="flex gap-2">
                <button onClick={submitContact} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <FiSend /> Envoyer
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
