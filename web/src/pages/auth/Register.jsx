import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullname: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'client',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (form.password.length < 6) {
      setError('Mot de passe trop court (6 caractères minimum)');
      return;
    }

    setLoading(true);
    const result = await register({
      fullname: form.fullname,
      email: form.email,
      phone: form.phone,
      password: form.password,
      role: form.role,
    });
    setLoading(false);

    if (result.success) {
      if (form.role === 'restaurant') navigate('/restaurant/settings');
      else navigate('/');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Créer un compte</h2>
      <p className="text-gray-500 mb-6">Rejoignez TOP 360°</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type de compte */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Je suis</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'client' })}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                form.role === 'client'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="text-xl block">👤</span>
              <span className="text-sm font-medium">Client</span>
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, role: 'restaurant' })}
              className={`p-3 rounded-xl border-2 text-center transition-all ${
                form.role === 'restaurant'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <span className="text-xl block">🏪</span>
              <span className="text-sm font-medium">Structure</span>
            </button>
          </div>
        </div>

        {form.role === 'restaurant' && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-700">
            💡 Après inscription, votre vitrine sera créée automatiquement. Vous pourrez la personnaliser dans votre espace.
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
          <input
            type="text"
            required
            value={form.fullname}
            onChange={(e) => setForm({ ...form, fullname: e.target.value })}
            className="input-field"
            placeholder="Votre nom"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="input-field"
            placeholder="exemple@email.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone (optionnel)</label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="input-field"
            placeholder="+225 01 02 03 04 05"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field"
            placeholder="Minimum 6 caractères"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
          <input
            type="password"
            required
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            className="input-field"
            placeholder="Confirmer"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
          {loading ? 'Inscription...' : 'Créer mon compte'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Déjà un compte ?{' '}
        <Link to="/login" className="text-green-700 font-medium hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
