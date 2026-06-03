import { useState } from 'react';
import { FiHardDrive, FiTool, FiClipboard, FiSend } from 'react-icons/fi';
import { appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';

const BAT_ICONS = [FiHardDrive, FiTool, FiClipboard, FiSend];

export default function VitrineBat({ restaurant }) {
  const categories = restaurant.menu_categories || [];
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || null);
  const [quote, setQuote] = useState({ item: null, name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const openQuote = (item) => setQuote({ item, name: '', phone: '', message: '' });

  const submitQuote = async () => {
    if (!quote.name || !quote.message) { toast.error('Nom et message requis'); return; }
    setLoading(true);
    try {
      await appointmentAPI.create({
        restaurant_id: restaurant.id,
        type: 'bat',
        item_name: quote.item?.name || 'Devis général',
        client_name: quote.name,
        client_phone: quote.phone || '',
        message: quote.message,
      });
      toast.success('Demande de devis envoyée avec succès !');
      setQuote({ item: null, name: '', phone: '', message: '' });
    } catch (error) {
      toast.error(error.response?.data?.error || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  const renderQuoteForm = () => (
    <div className="mt-8 card p-6">
      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
        <FiSend className="text-orange-600" /> Demander un devis
      </h3>
      <div className="space-y-3">
        <input type="text" placeholder="Votre nom" value={quote.name}
          onChange={e => setQuote({ ...quote, name: e.target.value })} className="input-field" />
        <input type="tel" placeholder="Téléphone" value={quote.phone}
          onChange={e => setQuote({ ...quote, phone: e.target.value })} className="input-field" />
        <textarea placeholder="Décrivez vos besoins..." value={quote.message}
          onChange={e => setQuote({ ...quote, message: e.target.value })} className="input-field" rows={3} />
        <button onClick={submitQuote} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <FiSend />}
          {loading ? 'Envoi...' : 'Envoyer la demande'}
        </button>
      </div>
    </div>
  );

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
                <button onClick={() => openQuote(item)} className="btn-primary text-sm px-4 py-2 mt-3 flex items-center gap-1">
                  <FiSend /> Demander un devis
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {renderQuoteForm()}

      {quote.item && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold mb-1">Devis : {quote.item.name}</h3>
            <p className="text-sm text-gray-500 mb-4">Demande de devis personnalisé</p>
            <div className="space-y-3">
              <input type="text" placeholder="Votre nom" value={quote.name}
                onChange={e => setQuote({ ...quote, name: e.target.value })} className="input-field" />
              <input type="tel" placeholder="Téléphone" value={quote.phone}
                onChange={e => setQuote({ ...quote, phone: e.target.value })} className="input-field" />
              <textarea placeholder="Décrivez vos besoins..." value={quote.message}
                onChange={e => setQuote({ ...quote, message: e.target.value })} className="input-field" rows={3} />
              <div className="flex gap-2">
                <button onClick={submitQuote} disabled={loading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                  {loading ? <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> : <FiSend />}
                  {loading ? 'Envoi...' : 'Envoyer'}
                </button>
                <button onClick={() => setQuote({ ...quote, item: null })} className="btn-outline flex-1">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
