import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);

    if (result.success) {
      if (result.user.role === 'restaurant') navigate('/restaurant/dashboard');
      else if (result.user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Connexion</h2>
      <p className="text-gray-500 mb-6">Accédez à votre espace TOP 360°</p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="input-field"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {loading && <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />}
          {loading ? 'Connexion...' : 'Se connecter'}
        </button>
      </form>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>Comptes de démonstration :</p>
        <div className="mt-2 space-y-1 text-xs text-gray-400">
          <p>Admin: admin@top360.ci / admin123</p>
          <p>Client: koffi@test.ci / client123</p>
          <p>Restaurant: mamadou@test.ci / resto123</p>
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">
        Pas encore de compte ?{' '}
        <Link to="/register" className="text-green-700 font-medium hover:underline">
          Créer un compte
        </Link>
      </p>
    </div>
  );
}
