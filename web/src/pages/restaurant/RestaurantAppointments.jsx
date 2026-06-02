import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { appointmentAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiCalendar } from 'react-icons/fi';

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

export default function RestaurantAppointments() {
  const { restaurant } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurant) loadAppointments();
  }, [restaurant]);

  const loadAppointments = async () => {
    try {
      const res = await appointmentAPI.list({ limit: 50 });
      setAppointments(res.data.appointments || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await appointmentAPI.updateStatus(id, status);
      loadAppointments();
      toast.success(`Rendez-vous ${STATUS_LABELS[status].toLowerCase()}`);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const filtered = appointments.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false;
    if (typeFilter !== 'all' && a.type !== typeFilter) return false;
    return true;
  });

  const pendingCount = appointments.filter(a => a.status === 'en_attente').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Rendez-vous
          {pendingCount > 0 && <span className="badge-red ml-2">{pendingCount} en attente</span>}
        </h1>
      </div>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button onClick={() => setFilter('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium ${filter === 'all' ? 'bg-orange-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
            Tous
          </button>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-medium ${filter === key ? 'bg-orange-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button onClick={() => setTypeFilter('all')}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${typeFilter === 'all' ? 'bg-forest-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
            Tous types
          </button>
          {Object.entries(TYPE_LABELS).map(([key, label]) => (
            <button key={key} onClick={() => setTypeFilter(key)}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium ${typeFilter === key ? 'bg-forest-700 text-white' : 'bg-gray-100 text-gray-600'}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mx-auto" />
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(apt => (
            <div key={apt.id} className="card p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <FiCalendar className="w-5 h-5 text-orange-700" />
                  </div>
                  <div>
                    <p className="font-semibold">{apt.client_name}</p>
                    <p className="text-sm text-gray-500">{apt.client_phone}</p>
                    {apt.client_email && <p className="text-xs text-gray-400">{apt.client_email}</p>}
                    <p className="text-xs text-gray-400 mt-1">{new Date(apt.created_at).toLocaleString('fr-FR')}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-forest-700 bg-forest-50 px-2 py-0.5 rounded-full">
                    {TYPE_LABELS[apt.type] || apt.type}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-1">
                <p className="text-sm"><span className="font-medium">Prestation :</span> {apt.item_name}</p>
                {apt.preferred_date && (
                  <p className="text-sm"><span className="font-medium">Date :</span> {new Date(apt.preferred_date).toLocaleDateString('fr-FR')}{apt.preferred_time ? ` à ${apt.preferred_time}` : ''}</p>
                )}
                {apt.guests && <p className="text-sm"><span className="font-medium">Invités :</span> {apt.guests}</p>}
                {apt.niveau && <p className="text-sm"><span className="font-medium">Niveau :</span> {apt.niveau}</p>}
                {apt.motif && <p className="text-sm"><span className="font-medium">Motif :</span> {apt.motif}</p>}
                {apt.message && <p className="text-sm text-gray-600 italic">"{apt.message}"</p>}
              </div>

              <div className="flex items-center justify-between">
                <span className={`badge ${
                  apt.status === 'en_attente' ? 'badge-yellow' :
                  apt.status === 'confirme' ? 'badge-green' :
                  apt.status === 'refuse' ? 'badge-red' : 'badge-red'
                }`}>
                  {STATUS_LABELS[apt.status]}
                </span>
                <div className="flex gap-2">
                  {apt.status === 'en_attente' && (
                    <>
                      <button onClick={() => updateStatus(apt.id, 'confirme')} className="btn-primary text-xs px-3 py-1.5">
                        Confirmer
                      </button>
                      <button onClick={() => updateStatus(apt.id, 'refuse')} className="btn-danger text-xs px-3 py-1.5">
                        Refuser
                      </button>
                    </>
                  )}
                  {apt.status === 'confirme' && (
                    <button onClick={() => updateStatus(apt.id, 'annule')} className="btn-danger text-xs px-3 py-1.5">
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">Aucun rendez-vous</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
