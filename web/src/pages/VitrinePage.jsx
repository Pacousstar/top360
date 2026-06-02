import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiClock, FiPhone, FiMapPin, FiArrowLeft, FiStar } from 'react-icons/fi';
import { restaurantAPI } from '../services/api';
import VitrineDelice from './vitrine/VitrineDelice';
import VitrineHotel from './vitrine/VitrineHotel';
import VitrineShop from './vitrine/VitrineShop';
import VitrineBat from './vitrine/VitrineBat';
import VitrineAuto from './vitrine/VitrineAuto';
import VitrineServices from './vitrine/VitrineServices';

const MODULE_LABELS = {
  top_delice: { emoji: '🍽️', name: 'TOP DÉLICE' },
  top_hotel: { emoji: '🏨', name: 'TOP HÔTEL' },
  top_bat: { emoji: '🏗️', name: 'TOP BAT' },
  top_shop: { emoji: '🛍️', name: 'TOP SHOP' },
  top_auto: { emoji: '🚗', name: 'TOP AUTO' },
  top_services: { emoji: '⚖️', name: 'TOP SERVICES' },
};

const CONTENT = {
  top_delice: VitrineDelice,
  top_hotel: VitrineHotel,
  top_bat: VitrineBat,
  top_shop: VitrineShop,
  top_auto: VitrineAuto,
  top_services: VitrineServices,
};

export default function VitrinePage() {
  const { slug } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurant();
  }, [slug]);

  const loadRestaurant = async () => {
    try {
      const res = await restaurantAPI.getBySlug(slug);
      setRestaurant(res.data);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

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
        <p className="text-xl text-gray-500">Vitrine non trouvée</p>
        <Link to="/" className="text-orange-700 mt-4 inline-block">Retour à l'accueil</Link>
      </div>
    );
  }

  const mod = restaurant.module || 'top_delice';
  const info = MODULE_LABELS[mod] || MODULE_LABELS.top_delice;
  const ContentComponent = CONTENT[mod] || CONTENT.top_delice;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
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
              {restaurant.logo ? <img src={restaurant.logo} alt="" className="w-full h-full rounded-xl object-cover" /> : info.emoji}
            </div>
            <div className="flex-1 text-white">
              <h1 className="text-2xl font-bold">{restaurant.name}</h1>
              <div className="flex items-center gap-3 text-sm text-white/80 mt-1">
                {restaurant.is_open ? (
                  <span className="text-orange-300">🟢 Ouvert</span>
                ) : (
                  <span>🔴 Fermé</span>
                )}
                {restaurant.avg_rating > 0 && <span>⭐ {restaurant.avg_rating}</span>}
                <span className="bg-white/20 px-2 py-0.5 rounded-md">{info.name}</span>
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

      {/* Contenu spécifique au module */}
      <ContentComponent restaurant={restaurant} />

      {/* Avis */}
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
    </div>
  );
}
