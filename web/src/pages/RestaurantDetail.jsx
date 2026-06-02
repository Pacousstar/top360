import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiClock, FiPhone, FiMapPin, FiArrowLeft, FiCheck, FiShoppingCart, FiStar } from 'react-icons/fi';
import { restaurantAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const COOKING_TYPES = ['grillé', 'sauce', 'braisé', 'patte'];
const SPICE_LEVELS = ['sans', 'un peu', 'moyen', 'fort'];
const ACCOMPANIMENTS = ['attiéké', 'pain', 'riz', 'frites'];

export default function RestaurantDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    loadRestaurant();
  }, [slug]);

  const loadRestaurant = async () => {
    try {
      const res = await restaurantAPI.getBySlug(slug);
      setRestaurant(res.data);
      if (res.data.menu_categories?.length > 0) {
        setSelectedCategory(res.data.menu_categories[0].id);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, cooking_type: null, spice_level: null, accompaniment: null }];
    });
    toast.success(`${item.name} ajouté au panier`);
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(i => i.id !== itemId));
  };

  const updateCartItem = (itemId, field, value) => {
    setCart(prev => prev.map(i => i.id === itemId ? { ...i, [field]: value } : i));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.base_price * item.quantity), 0);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-48 bg-gray-200 rounded-2xl" />
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-xl text-gray-500">Restaurant non trouvé</p>
        <Link to="/" className="text-orange-700 mt-4 inline-block">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Back button */}
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-orange-700 mb-4">
        <FiArrowLeft /> Retour
      </Link>

      {/* Hero */}
      <div className="h-48 sm:h-64 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 relative overflow-hidden mb-6">
        {restaurant.banner && <img src={restaurant.banner} alt="" className="w-full h-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-end gap-4">
            <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl">
              {restaurant.logo ? <img src={restaurant.logo} alt="" className="w-full h-full rounded-xl object-cover" /> : '🍽️'}
            </div>
            <div className="flex-1 text-white">
              <h1 className="text-2xl font-bold">{restaurant.name}</h1>
              <div className="flex items-center gap-3 text-sm text-white/80 mt-1">
                {restaurant.is_open ? (
                  <span className="status-open text-orange-300">🟢 Ouvert</span>
                ) : (
                  <span className="status-closed">🔴 Fermé</span>
                )}
                {restaurant.avg_rating > 0 && <span>⭐ {restaurant.avg_rating}</span>}
                <span>{restaurant.module?.replace('top_', '').toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Infos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {restaurant.city && (
          <div className="flex items-center gap-2 text-gray-600 bg-white rounded-xl p-3 border">
            <FiMapPin className="text-orange-600" />
            <span className="text-sm">{restaurant.city} {restaurant.address ? `- ${restaurant.address}` : ''}</span>
          </div>
        )}
        {restaurant.phone && (
          <a href={`tel:${restaurant.phone}`} className="flex items-center gap-2 text-gray-600 bg-white rounded-xl p-3 border hover:bg-orange-50">
            <FiPhone className="text-orange-600" />
            <span className="text-sm">{restaurant.phone}</span>
          </a>
        )}
        {restaurant.opening_time && (
          <div className="flex items-center gap-2 text-gray-600 bg-white rounded-xl p-3 border">
            <FiClock className="text-orange-600" />
            <span className="text-sm">{restaurant.opening_time?.slice(0, 5)} - {restaurant.closing_time?.slice(0, 5)}</span>
          </div>
        )}
      </div>

      {restaurant.description && (
        <p className="text-gray-600 mb-8">{restaurant.description}</p>
      )}

      {/* Menu */}
      {restaurant.menu_categories?.length > 0 && (
        <div>
          {/* Categories tabs */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide mb-6 pb-2">
            {restaurant.menu_categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-orange-700 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Items */}
          {restaurant.menu_categories
            .filter(cat => cat.id === selectedCategory)
            .map(cat => (
              <div key={cat.id} className="space-y-3">
                {cat.menu_items?.map(item => (
                  <div key={item.id} className="card p-4 flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{item.name}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                          )}
                        </div>
                        <span className="font-semibold text-orange-700 whitespace-nowrap">
                          {item.base_price?.toLocaleString()} FCFA
                        </span>
                      </div>

                      {/* Options */}
                      {item.cooking_types?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {item.cooking_types.map(t => (
                            <span key={t} className="badge bg-gray-100 text-gray-600 text-xs">{t}</span>
                          ))}
                        </div>
                      )}

                      <button
                        onClick={() => addToCart(item)}
                        disabled={!item.is_available}
                        className="mt-3 btn-primary text-sm px-4 py-2 inline-flex items-center gap-1.5"
                      >
                        <FiShoppingCart /> Ajouter
                      </button>
                    </div>
                    {item.image && (
                      <img src={item.image} alt="" className="w-20 h-20 rounded-xl object-cover" />
                    )}
                  </div>
                ))}
              </div>
            ))}
        </div>
      )}

      {(!restaurant.menu_categories || restaurant.menu_categories.length === 0) && (
        <div className="text-center py-12 text-gray-500">
          <p>Aucun menu disponible pour le moment</p>
        </div>
      )}

      {/* Avis clients */}
      {restaurant.reviews?.length > 0 && (
        <section className="mt-8">
          <h2 className="section-title flex items-center gap-2">
            <FiStar className="text-yellow-500" /> Avis clients ({restaurant.review_count})
          </h2>
          <div className="space-y-3">
            {restaurant.reviews.map(review => (
              <div key={review.id} className="card p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-sm font-medium text-orange-700">
                    {review.client?.fullname?.[0] || '?'}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{review.client?.fullname || 'Anonyme'}</p>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={`text-sm ${star <= review.rating ? 'text-yellow-500' : 'text-gray-200'}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 ml-auto">{new Date(review.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
                {review.comment && <p className="text-sm text-gray-600">{review.comment}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Cart floating button */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 left-4 right-4 z-40 max-w-md mx-auto">
          <button
            onClick={() => setShowCart(true)}
            className="w-full glass-card px-6 py-4 flex items-center justify-between text-orange-900"
          >
            <span className="flex items-center gap-2">
              <FiShoppingCart className="w-5 h-5" />
              <span className="font-medium">{cart.reduce((s, i) => s + i.quantity, 0)} article(s)</span>
            </span>
            <span className="font-bold">{cartTotal.toLocaleString()} FCFA</span>
          </button>
        </div>
      )}

      {/* Cart modal */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
              <h3 className="font-bold text-lg">Votre commande</h3>
              <button onClick={() => setShowCart(false)} className="text-gray-500">✕</button>
            </div>
            <div className="p-4 space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm">✕</button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <button onClick={() => updateCartItem(item.id, 'quantity', Math.max(1, item.quantity - 1))} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">-</button>
                      <span className="font-medium">{item.quantity}</span>
                      <button onClick={() => updateCartItem(item.id, 'quantity', item.quantity + 1)} className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">+</button>
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
                  <Link
                    to="/cart"
                    state={{ restaurant, cart, cartTotal }}
                    className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                    onClick={() => setShowCart(false)}
                  >
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
