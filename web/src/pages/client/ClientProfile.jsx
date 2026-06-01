import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function ClientProfile() {
  const { user, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: user?.fullname || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await updateProfile(form);
    setSaving(false);
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold mb-6">Mon profil</h1>

      <div className="card p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
          <input
            type="text"
            value={form.fullname}
            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="input-field bg-gray-50 text-gray-500"
          />
          <p className="text-xs text-gray-400 mt-1">L'email ne peut pas être modifié</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input-field"
          />
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      <button
        onClick={() => { logout(); navigate('/'); }}
        className="mt-4 text-red-500 font-medium hover:underline text-sm"
      >
        Se déconnecter
      </button>
    </div>
  );
}
