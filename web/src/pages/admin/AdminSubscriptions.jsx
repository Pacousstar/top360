import { useState, useEffect } from 'react';
import { adminAPI, subscriptionAPI } from '../../services/api';
import { FiCheck, FiX } from 'react-icons/fi';

export default function AdminSubscriptions() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSubscriptions();
  }, []);

  const loadSubscriptions = async () => {
    try {
      const res = await adminAPI.subscriptions();
      setSubscriptions(res.data.subscriptions || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Abonnements</h1>

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
                  <th className="text-left p-4 font-medium text-gray-600">Restaurant</th>
                  <th className="text-left p-4 font-medium text-gray-600">Plan</th>
                  <th className="text-left p-4 font-medium text-gray-600">Montant</th>
                  <th className="text-left p-4 font-medium text-gray-600">Début</th>
                  <th className="text-left p-4 font-medium text-gray-600">Fin</th>
                  <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {subscriptions.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{s.restaurant?.name || '—'}</td>
                    <td className="p-4 capitalize">{s.plan}</td>
                    <td className="p-4 font-medium">{s.amount?.toLocaleString()} FCFA</td>
                    <td className="p-4 text-gray-500">{new Date(s.start_date).toLocaleDateString('fr-FR')}</td>
                    <td className="p-4 text-gray-500">{new Date(s.end_date).toLocaleDateString('fr-FR')}</td>
                    <td className="p-4">
                      {s.status === 'active' ? (
                        <span className="badge-green flex items-center gap-1 w-fit"><FiCheck /> Actif</span>
                      ) : s.status === 'expiree' ? (
                        <span className="badge-red flex items-center gap-1 w-fit"><FiX /> Expiré</span>
                      ) : (
                        <span className="badge-yellow w-fit">{s.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {subscriptions.length === 0 && (
            <p className="text-center py-12 text-gray-500">Aucun abonnement</p>
          )}
        </div>
      )}
    </div>
  );
}
