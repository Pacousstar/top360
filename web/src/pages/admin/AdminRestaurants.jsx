import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiExternalLink } from 'react-icons/fi';
import { Link } from 'react-router-dom';

export default function AdminRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const res = await adminAPI.restaurants({ limit: 100 });
      setRestaurants(res.data.restaurants || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVerification = async (id) => {
    try {
      await adminAPI.toggleActive(id);
      loadRestaurants();
      toast.success('Statut modifié');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Gestion des restaurants</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mx-auto" />
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 font-medium text-gray-600">Nom</th>
                  <th className="text-left p-4 font-medium text-gray-600">Module</th>
                  <th className="text-left p-4 font-medium text-gray-600">Propriétaire</th>
                  <th className="text-left p-4 font-medium text-gray-600">Abonnement</th>
                  <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {restaurants.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium">{r.name}</p>
                      <p className="text-xs text-gray-400">{r.slug}</p>
                    </td>
                    <td className="p-4 text-gray-600">{r.module?.replace('top_', '').toUpperCase()}</td>
                    <td className="p-4">
                      <p>{r.owner?.fullname || '—'}</p>
                      <p className="text-xs text-gray-400">{r.owner?.email}</p>
                    </td>
                    <td className="p-4">
                      <span className={r.subscription_plan ? 'badge-green' : 'badge-red'}>
                        {r.subscription_plan || 'Aucun'}
                      </span>
                    </td>
                    <td className="p-4">
                      {r.is_verified ? (
                        <span className="badge-green flex items-center gap-1"><FiCheck /> Vérifié</span>
                      ) : (
                        <span className="badge-yellow flex items-center gap-1"><FiX /> En attente</span>
                      )}
                      {r.is_open && <span className="ml-1 badge-green">Ouvert</span>}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/restaurant/${r.slug}`}
                          target="_blank"
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
                          title="Voir la vitrine"
                        >
                          <FiExternalLink className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => toggleVerification(r.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium ${r.is_verified ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}
                        >
                          {r.is_verified ? 'Suspendre' : 'Activer'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {restaurants.length === 0 && (
            <p className="text-center py-12 text-gray-500">Aucun restaurant</p>
          )}
        </div>
      )}
    </div>
  );
}
