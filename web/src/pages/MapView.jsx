import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { restaurantAPI } from '../services/api';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MODULE_ICONS = {
  top_delice: '🍽️',
  top_bat: '🏗️',
  top_hotel: '🏨',
  top_shop: '🛍️',
  top_auto: '🚗',
  top_services: '⚖️',
};

const CENTER_CI = [7.539989, -5.547080]; // Centre Côte d'Ivoire
const CENTER_GUEMON = [6.5000, -7.5000]; // Région du Guémon

export default function MapView() {
  const [restaurants, setRestaurants] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const res = await restaurantAPI.list({ limit: 100 });
      setRestaurants(res.data.restaurants || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = filter === 'all'
    ? restaurants
    : restaurants.filter(r => r.module === filter);

  const modules = [...new Set(restaurants.map(r => r.module))];

  return (
    <div className="h-[calc(100vh-4rem)] relative">
      {/* Filtres */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-3 overflow-x-auto">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all' ? 'bg-orange-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
              {modules.map(mod => (
                <button
                  key={mod}
                  onClick={() => setFilter(mod)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === mod ? 'bg-orange-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {MODULE_ICONS[mod] || '📍'} {mod.replace('top_', '').toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Carte */}
      {!loading && (
        <MapContainer
          center={CENTER_GUEMON}
          zoom={10}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredRestaurants.map((r) => (
            r.latitude && r.longitude && (
              <Marker key={r.id} position={[r.latitude, r.longitude]}>
                <Popup>
                  <div className="min-w-[200px]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{MODULE_ICONS[r.module] || '📍'}</span>
                      <h3 className="font-semibold">{r.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{r.city || 'Non localisé'}</p>
                    {r.is_open ? (
                      <span className="badge-green text-xs">🟢 Ouvert</span>
                    ) : (
                      <span className="badge-red text-xs">🔴 Fermé</span>
                    )}
                    {r.is_featured && <span className="badge-yellow text-xs ml-1">⭐ Sponsor</span>}
                    <div className="mt-3">
                      <Link
                        to={`/restaurant/${r.slug}`}
                        className="btn-primary text-xs px-3 py-1.5 block text-center"
                      >
                        Voir la boutique
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      )}

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent mx-auto mb-4" />
            <p className="text-gray-500">Chargement de la carte...</p>
          </div>
        </div>
      )}

      {/* Légende */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-3 text-xs text-gray-500 text-center">
            <span className="font-medium">TOP 360° MAP</span> — Carte interactive des commerces et services locaux
            {' · '}Région du Guémon, Côte d'Ivoire 🇨🇮
          </div>
        </div>
      </div>
    </div>
  );
}
