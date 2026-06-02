import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { restaurantAPI } from '../../services/api';
import { subscriptionAPI } from '../../services/api';
import toast from 'react-hot-toast';

const PLANS = [
  { key: 'starter', name: 'Starter', price: '3 000', desc: 'Pour petits commerces', features: ['Vitrine numérique', 'Catalogue produits', 'Commandes', 'Notifications'] },
  { key: 'business', name: 'Business', price: '7 500', desc: 'Pour commerces en croissance', features: ['Tout du Starter', 'Statistiques avancées', 'Promotions sponsorisées', 'Mise en avant'] },
  { key: 'premium', name: 'Premium', price: '15 000', desc: 'Pour professionnels', features: ['Tout du Business', 'Visibilité prioritaire', 'Analytics avancés', 'Support prioritaire'] },
];

export default function RestaurantSettings() {
  const { restaurant, setRestaurant } = useAuth();
  const [form, setForm] = useState({
    name: restaurant?.name || '',
    description: restaurant?.description || '',
    phone: restaurant?.phone || '',
    address: restaurant?.address || '',
    city: restaurant?.city || '',
    logo: restaurant?.logo || '',
    banner: restaurant?.banner || '',
    opening_time: restaurant?.opening_time?.slice(0, 5) || '',
    closing_time: restaurant?.closing_time?.slice(0, 5) || '',
    module: restaurant?.module || 'top_delice',
  });
  const [saving, setSaving] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  const handleSave = async () => {
    if (!restaurant) return;
    setSaving(true);
    try {
      const res = await restaurantAPI.update(restaurant.id, form);
      setRestaurant(res.data.restaurant);
      toast.success('Paramètres mis à jour');
    } catch (error) {
      toast.error('Erreur');
    } finally {
      setSaving(false);
    }
  };

  const handleSubscribe = async (plan) => {
    if (!restaurant) return;
    setSubscribing(true);
    try {
      await subscriptionAPI.subscribe({ restaurant_id: restaurant.id, plan });
      toast.success(`Abonnement ${plan} activé !`);
    } catch (error) {
      toast.error('Erreur');
    } finally {
      setSubscribing(false);
    }
  };

  if (!restaurant) return <p className="text-center py-8">Aucun restaurant associé</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Paramètres de la boutique</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Infos */}
        <div className="space-y-4">
          <div className="card p-6 space-y-4">
            <h2 className="font-semibold text-lg">Informations générales</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Logo (URL)</label>
              <div className="flex items-center gap-3">
                {form.logo && <img src={form.logo} alt="logo" className="w-12 h-12 rounded-xl object-cover border" />}
                <input type="text" value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} className="input-field flex-1" placeholder="https://exemple.com/logo.png" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bannière (URL)</label>
              {form.banner && <div className="h-20 rounded-xl bg-gray-100 mb-2 overflow-hidden"><img src={form.banner} alt="banner" className="w-full h-full object-cover" /></div>}
              <input type="text" value={form.banner} onChange={(e) => setForm({ ...form, banner: e.target.value })} className="input-field" placeholder="https://exemple.com/banniere.png" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
              <select value={form.module} onChange={(e) => setForm({ ...form, module: e.target.value })} className="input-field">
                <option value="top_delice">🍽️ TOP DÉLICE</option>
                <option value="top_bat">🏗️ TOP BAT</option>
                <option value="top_hotel">🏨 TOP HOTEL</option>
                <option value="top_shop">🛍️ TOP SHOP</option>
                <option value="top_auto">🚗 TOP AUTO</option>
                <option value="top_services">⚖️ TOP SERVICES</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
                <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                <input type="text" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="input-field" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
              <input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="input-field" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ouverture</label>
                <input type="time" value={form.opening_time} onChange={(e) => setForm({ ...form, opening_time: e.target.value })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fermeture</label>
                <input type="time" value={form.closing_time} onChange={(e) => setForm({ ...form, closing_time: e.target.value })} className="input-field" />
              </div>
            </div>
            <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>

        {/* Abonnement */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Abonnement actuel : {restaurant.subscription_plan || 'Aucun'}</h2>
          <div className="space-y-4">
            {PLANS.map(plan => {
              const isActive = restaurant.subscription_plan === plan.key;
              return (
                <div key={plan.key} className={`card p-6 ${isActive ? 'ring-2 ring-orange-500 shadow-lg shadow-orange-200' : ''}`}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{plan.name}</h3>
                      <p className="text-sm text-gray-500">{plan.desc}</p>
                    </div>
                    <p className="text-2xl font-bold text-orange-700">{plan.price} <span className="text-sm font-normal">FCFA/mois</span></p>
                  </div>
                  <ul className="space-y-1.5 mb-4">
                    {plan.features.map((f, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => handleSubscribe(plan.key)}
                    disabled={subscribing || isActive}
                    className={`w-full py-2.5 rounded-xl font-medium transition-all ${
                      isActive
                        ? 'bg-orange-100 text-orange-700 cursor-default'
                        : 'bg-orange-600 text-white hover:bg-orange-700 shadow-lg shadow-orange-200 hover:shadow-xl'
                    }`}
                  >
                    {isActive ? 'Plan actif' : `Souscrire à ${plan.name}`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
