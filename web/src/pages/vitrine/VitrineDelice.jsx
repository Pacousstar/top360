import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function VitrineDelice({ restaurant }) {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(
    restaurant.menu_categories?.[0]?.id || null
  );
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} ajouté`);
  };

  const removeFromCart = (itemId) => setCart(prev => prev.filter(i => i.id !== itemId));
  const updateQty = (itemId, delta) => setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i));
  const cartTotal = cart.reduce((sum, item) => sum + (item.base_price * item.quantity), 0);

  if (!restaurant.menu_categories?.length) {
    return <div className="text-center py-12 text-gray-500"><p>Aucun menu disponible</p></div>;
  }

  return (
    <div>
      {/* Catégories */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2">
        {restaurant.menu_categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              selectedCategory === cat.id ? 'bg-orange-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Items */}
      {restaurant.menu_categories.filter(c => c.id === selectedCategory).map(cat => (
        <div key={cat.id} className="space-y-3">
          {cat.menu_items?.map(item => (
            <div key={item.id} className="card p-4 flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    {item.description && <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>}
                  </div>
                  <span className="font-semibold text-orange-700 whitespace-nowrap">{item.base_price?.toLocaleString()} FCFA</span>
                </div>
                {item.cooking_types?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {item.cooking_types.map(t => (
                      <span key={t} className="badge bg-gray-100 text-gray-600 text-xs">{t}</span>
                    ))}
                  </div>
                )}
                <button onClick={() => addToCart(item)} disabled={!item.is_available}
                  className="mt-3 btn-primary text-sm px-4 py-2 inline-flex items-center gap-1.5">
                  <FiShoppingCart /> Ajouter
                </button>
              </div>
              {item.image && <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover" />}
            </div>
          ))}
        </div>
      ))}

      {/* Panier flottant */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto">
          <button onClick={() => setShowCart(true)}
            className="w-full glass-card px-6 py-4 flex items-center justify-between text-orange-900">
            <span className="flex items-center gap-2">
              <FiShoppingCart className="w-5 h-5" />
              <span className="font-medium">{cart.reduce((s, i) => s + i.quantity, 0)} article(s)</span>
            </span>
            <span className="font-bold">{cartTotal.toLocaleString()} FCFA</span>
          </button>
        </div>
      )}

      {/* Modal panier */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="font-bold text-lg">Votre commande</h3>
              <button onClick={() => setShowCart(false)} className="text-gray-500">✕</button>
            </div>
            <div className="p-4 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm">✕</button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateQty(item.id, -1)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">-</button>
                      <span className="font-medium">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">+</button>
                      <span className="text-orange-700 font-medium ml-auto">{(item.base_price * item.quantity).toLocaleString()} FCFA</span>
                    </div>
                  </div>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{cartTotal.toLocaleString()} FCFA</span>
                </div>
                {user ? (
                  <Link to="/cart" state={{ restaurant, cart, cartTotal }}
                    className="btn-primary w-full mt-4 flex items-center justify-center gap-2" onClick={() => setShowCart(false)}>
                    <FiCheck /> Passer la commande
                  </Link>
                ) : (
                  <Link to="/login" className="btn-primary w-full mt-4 flex items-center justify-center">
                    Connectez-vous pour commander
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
