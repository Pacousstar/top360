import { useState } from 'react';
import { FiHardDrive, FiTool, FiClipboard, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const BAT_ICONS = [FiHardDrive, FiTool, FiClipboard, FiSend];

export default function VitrineBat({ restaurant }) {
  const categories = restaurant.menu_categories || [];
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || null);
  const [quote, setQuote] = useState({ name: '', phone: '', message: '' });

  const sendQuote = () => {
    if (!quote.name || !quote.message) { toast.error('Nom et message requis'); return; }
    toast.success('Demande de devis envoyée !');
    setQuote({ name: '', phone: '', message: '' });
  };

  if (!categories.length) {
    return (
      <div>
        <div className="text-center py-8 text-gray-500">
          <p>Aucun service publié</p>
        </div>
        {renderQuoteForm()}
      </div>
    );
  }

  function renderQuoteForm() {
    return (
      <div className="mt-8 card p-6">
        <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <FiSend className="text-orange-600" /> Demander un devis
        </h3>
        <div className="space-y-3">
          <input type="text" placeholder="Votre nom" value={quote.name}
            onChange={e => setQuote({ ...quote, name: e.target.value })}
            className="input-field" />
          <input type="tel" placeholder="Téléphone" value={quote.phone}
            onChange={e => setQuote({ ...quote, phone: e.target.value })}
            className="input-field" />
          <textarea placeholder="Décrivez vos besoins..." value={quote.message}
            onChange={e => setQuote({ ...quote, message: e.target.value })}
            className="input-field" rows={3} />
          <button onClick={sendQuote} className="btn-primary w-full flex items-center justify-center gap-2">
            <FiSend /> Envoyer la demande
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2">
        {categories.map((cat, i) => {
          const Icon = BAT_ICONS[i] || FiTool;
          return (
            <button key={cat.id} onClick={() => setSelectedCat(cat.id)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                selectedCat === cat.id ? 'bg-orange-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              <Icon className="w-4 h-4" /> {cat.name}
            </button>
          );
        })}
      </div>

      {categories.filter(c => c.id === selectedCat).map(cat => (
        <div key={cat.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {cat.menu_items?.map(item => (
            <div key={item.id} className="card overflow-hidden">
              {item.image && <img src={item.image} alt="" className="w-full h-36 object-cover" />}
              <div className="p-4">
                <h3 className="font-semibold">{item.name}</h3>
                {item.description && <p className="text-sm text-gray-500 mt-1">{item.description}</p>}
                {item.base_price > 0 && (
                  <p className="text-orange-700 font-bold mt-2">À partir de {item.base_price?.toLocaleString()} FCFA</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}

      {renderQuoteForm()}
    </div>
  );
}
