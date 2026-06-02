import { useState } from 'react';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function VitrineShop({ restaurant }) {
  const { user } = useAuth();
  const categories = restaurant.menu_categories || [];
  const [selectedCat, setSelectedCat] = useState(categories[0]?.id || null);
  const [cart, setCart] = useState([]);

  const toggleCart = (item) => {
    setCart(prev => {
      const ex = prev.find(i => i.id === item.id);
      if (ex) return prev.filter(i => i.id !== item.id);
      return [...prev, { ...item, quantity: 1 }];
    });
    if (cart.find(i => i.id === item.id)) {
      toast.success(`${item.name} retiré`);
    } else {
      toast.success(`${item.name} ajouté au panier`);
    }
  };

  const cartTotal = cart.reduce((s, i) => s + (i.base_price * i.quantity), 0);

  if (!categories.length) {
    return <div className="text-center py-12 text-gray-500"><p>Aucun produit disponible</p></div>;
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
        <div key={cat.id} className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {cat.menu_items?.map(item => {
            const inCart = cart.find(i => i.id === item.id);
            return (
              <div key={item.id} className="card p-3">
                {item.image && <img src={item.image} alt="" className="w-full h-28 object-cover rounded-xl mb-2" />}
                <h3 className="font-medium text-sm truncate">{item.name}</h3>
                {item.description && <p className="text-xs text-gray-500 truncate">{item.description}</p>}
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-bold text-orange-700 text-sm">{item.base_price?.toLocaleString()} FCFA</span>
                  <button onClick={() => toggleCart(item)}
                    className={`text-xs px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      inCart ? 'bg-green-600 text-white' : 'bg-orange-600 text-white'
                    }`}>
                    {inCart ? <FiCheck /> : <FiShoppingCart />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {cart.length > 0 && (
        <div className="mt-6 p-4 bg-white border rounded-xl">
          <h3 className="font-semibold mb-2">Panier ({cart.length})</h3>
          {cart.map(item => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
              <span>{item.name}</span>
              <span className="font-medium">{item.base_price?.toLocaleString()} FCFA</span>
            </div>
          ))}
          <div className="flex justify-between font-bold mt-2 pt-2 border-t">
            <span>Total</span>
            <span>{cartTotal.toLocaleString()} FCFA</span>
          </div>
          {user ? (
            <button className="btn-primary w-full mt-3 text-sm">Commander</button>
          ) : (
            <a href="/login" className="btn-primary w-full mt-3 text-sm text-center block">Connectez-vous pour commander</a>
          )}
        </div>
      )}
    </div>
  );
}
