import { useState } from 'react';
import { FiCalendar, FiZap } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function VitrineAuto({ restaurant }) {
  const categories = restaurant.menu_categories || [];
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || null);

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
                    <button className="btn-primary text-sm px-4 py-2" onClick={() => toast.success('Demande envoyée au vendeur')}>
                      Contacter
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
