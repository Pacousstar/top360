import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, [filter]);

  const loadUsers = async () => {
    try {
      const params = {};
      if (filter !== 'all') params.role = filter;
      const res = await adminAPI.users(params);
      setUsers(res.data.users || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Utilisateurs</h1>

      <div className="flex gap-2 mb-6">
        {[
          { key: 'all', label: 'Tous' },
          { key: 'client', label: '👤 Clients' },
          { key: 'restaurant', label: '🏪 Restaurants' },
          { key: 'admin', label: '👑 Admins' },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setFilter(item.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${filter === item.key ? 'bg-orange-700 text-white' : 'bg-gray-100 text-gray-600'}`}
          >
            {item.label}
          </button>
        ))}
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
                  <th className="text-left p-4 font-medium text-gray-600">Nom</th>
                  <th className="text-left p-4 font-medium text-gray-600">Email</th>
                  <th className="text-left p-4 font-medium text-gray-600">Téléphone</th>
                  <th className="text-left p-4 font-medium text-gray-600">Rôle</th>
                  <th className="text-left p-4 font-medium text-gray-600">Inscription</th>
                  <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="p-4 font-medium">{u.fullname}</td>
                    <td className="p-4 text-gray-500">{u.email}</td>
                    <td className="p-4 text-gray-500">{u.phone || '—'}</td>
                    <td className="p-4">
                      <span className={`badge ${
                        u.role === 'admin' ? 'badge-blue' :
                        u.role === 'restaurant' ? 'badge-green' : 'badge-yellow'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="p-4">
                      {u.is_active ? (
                        <span className="badge-green">Actif</span>
                      ) : (
                        <span className="badge-red">Inactif</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {users.length === 0 && (
            <p className="text-center py-12 text-gray-500">Aucun utilisateur</p>
          )}
        </div>
      )}
    </div>
  );
}
