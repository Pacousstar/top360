import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

const STATUS_LABELS = {
  en_attente: 'En attente',
  confirme: 'Confirmé',
  refuse: 'Refusé',
  annule: 'Annulé',
};

const TYPE_LABELS = {
  service: 'Service',
  sante: 'Santé',
  education: 'Éducation',
  immo: 'Immobilier',
  event: 'Événementiel',
};

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const params = { limit: 100 };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (typeFilter !== 'all') params.type = typeFilter;
      const res = await adminAPI.appointments(params);
      setAppointments(res.data.appointments || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [statusFilter, typeFilter]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Tous les rendez-vous</h1>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {['all', ...Object.keys(STATUS_LABELS)].map(key => (
            <button key={key} onClick={() => setStatusFilter(key)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium ${statusFilter === key ? 'bg-orange-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {key === 'all' ? 'Tous' : STATUS_LABELS[key]}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {['all', ...Object.keys(TYPE_LABELS)].map(key => (
            <button key={key} onClick={() => setTypeFilter(key)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${typeFilter === key ? 'bg-forest-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {key === 'all' ? 'Tous types' : TYPE_LABELS[key]}
            </button>
          ))}
        </div>
      </div>

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
                  <th className="text-left p-4 font-medium text-gray-600">Client</th>
                  <th className="text-left p-4 font-medium text-gray-600">Restaurant</th>
                  <th className="text-left p-4 font-medium text-gray-600">Prestation</th>
                  <th className="text-left p-4 font-medium text-gray-600">Type</th>
                  <th className="text-left p-4 font-medium text-gray-600">Date</th>
                  <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {appointments.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium">{a.client_name}</p>
                      <p className="text-xs text-gray-400">{a.client_phone}</p>
                      {a.client_email && <p className="text-xs text-gray-400">{a.client_email}</p>}
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{a.restaurant?.name || '—'}</p>
                      <p className="text-xs text-gray-400">{a.restaurant?.module?.replace('top_', '')}</p>
                    </td>
                    <td className="p-4 text-gray-600">{a.item_name}</td>
                    <td className="p-4">
                      <span className="text-xs font-medium text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full">
                        {TYPE_LABELS[a.type] || a.type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 text-xs">
                      {a.preferred_date ? new Date(a.preferred_date).toLocaleDateString('fr-FR') : '—'}
                      {a.preferred_time && <> à {a.preferred_time}</>}
                      <br />
                      <span className="text-gray-400">Créé le {new Date(a.created_at).toLocaleDateString('fr-FR')}</span>
                    </td>
                    <td className="p-4">
                      <span className={`badge ${
                        a.status === 'en_attente' ? 'badge-yellow' :
                        a.status === 'confirme' ? 'badge-green' :
                        'badge-red'
                      }`}>
                        {STATUS_LABELS[a.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {appointments.length === 0 && (
            <p className="text-center py-12 text-gray-500">Aucun rendez-vous</p>
          )}
        </div>
      )}
    </div>
  );
}
