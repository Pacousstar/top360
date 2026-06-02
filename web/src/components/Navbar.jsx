import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiSearch, FiMapPin, FiMenu, FiX, FiUser, FiLogOut } from 'react-icons/fi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    switch (user.role) {
      case 'restaurant': return '/restaurant/dashboard';
      case 'admin': return '/admin/dashboard';
      default: return '/client/orders';
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-orange-800">TOP 360°</span>
          </Link>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Restaurant, service, produit..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
              />
            </div>
          </form>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link to="/map" className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors">
              <FiMapPin className="w-4 h-4" />
              <span>Carte</span>
            </Link>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to={getDashboardLink()} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-orange-600 text-white text-sm rounded-xl hover:bg-orange-700 transition-all shadow-md">
                  <FiUser className="w-4 h-4" />
                  <span>Mon espace</span>
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); }}
                  className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  title="Déconnexion"
                >
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm text-gray-700 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="px-4 py-2 text-sm bg-orange-700 text-white rounded-xl hover:bg-orange-800 transition-colors">
                  Inscription
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 rounded-xl hover:bg-gray-100"
            >
              {mobileMenu ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenu && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearch} className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50"
            />
          </form>
          <Link to="/map" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-xl" onClick={() => setMobileMenu(false)}>
            <FiMapPin /> Carte interactive
          </Link>
          {user && (
            <Link to={getDashboardLink()} className="flex items-center gap-2 px-4 py-2 text-orange-700 hover:bg-orange-50 rounded-xl" onClick={() => setMobileMenu(false)}>
              <FiUser /> Mon espace
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
