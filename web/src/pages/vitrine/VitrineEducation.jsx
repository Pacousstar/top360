import { useState } from 'react';
import { FiBookOpen, FiClock, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function VitrineEducation({ restaurant }) {
  const categories = restaurant.menu_categories || [];
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || null);
  const [insc, setInsc] = useState({ item: null, name: '', phone: '', email: '', niveau: '' });

  const openInsc = (item) => setInsc({ item, name: '', phone: '', email: '', niveau: '' });

  const submitInsc = () => {
    if (!insc.name || !insc.phone) { toast.error('Nom et téléphone requis'); return; }
    toast.success(`Inscription à ${insc.item.name} envoyée`);
    setInsc({ item: null, name: '', phone: '', email: '', niveau: '' });
  };

  if (!categories.length) {
    return <div className="text-center py-12 text-gray-500"><p>Formations à venir</p></div>;
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
                <div className="flex items-start gap-2 mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    {item.description && <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>}
                  </div>
                  {item.base_price > 0 && (
                    <span className="text-orange-700 font-bold whitespace-nowrap">{item.base_price?.toLocaleString()} FCFA</span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                  {item.cooking_types?.includes('en_ligne') && <span className="flex items-center gap-1"><FiClock /> En ligne</span>}
                  {item.cooking_types?.includes('presentiel') && <span className="flex items-center gap-1"><FiBookOpen /> Présentiel</span>}
                </div>
                <button onClick={() => openInsc(item)} className="btn-primary text-sm px-4 py-2 w-full flex items-center justify-center gap-1">
                  <FiSend /> S'inscrire
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {insc.item && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-1">Inscription : {insc.item.name}</h3>
            <p className="text-sm text-gray-500 mb-4">{insc.item.base_price?.toLocaleString()} FCFA</p>
            <div className="space-y-3">
              <input type="text" placeholder="Nom complet" value={insc.name}
                onChange={e => setInsc({ ...insc, name: e.target.value })} className="input-field" />
              <input type="tel" placeholder="Téléphone" value={insc.phone}
                onChange={e => setInsc({ ...insc, phone: e.target.value })} className="input-field" />
              <input type="email" placeholder="Email" value={insc.email}
                onChange={e => setInsc({ ...insc, email: e.target.value })} className="input-field" />
              <select value={insc.niveau} onChange={e => setInsc({ ...insc, niveau: e.target.value })} className="input-field">
                <option value="">Niveau d'étude</option>
                <option value="primaire">Primaire</option>
                <option value="secondaire">Secondaire</option>
                <option value="universite">Université</option>
                <option value="professionnel">Professionnel</option>
              </select>
              <div className="flex gap-2">
                <button onClick={submitInsc} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  <FiSend /> Envoyer
                </button>
                <button onClick={() => setInsc({ ...insc, item: null })} className="btn-outline flex-1">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
