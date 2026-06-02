import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiShoppingBag, FiClipboard, FiSettings, FiBarChart2, FiUsers, FiCreditCard, FiLogOut, FiBell, FiMenu, FiX, FiMapPin } from 'react-icons/fi';
import { useState } from 'react';

export default function DashboardLayout({ role }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const clientMenu = [
    { icon: FiHome, label: 'Accueil', path: '/' },
    { icon: FiShoppingBag, label: 'Mes commandes', path: '/client/orders' },
    { icon: FiSettings, label: 'Mon profil', path: '/client/profile' },
  ];

  const restaurantMenu = [
    { icon: FiBarChart2, label: 'Dashboard', path: '/restaurant/dashboard' },
    { icon: FiClipboard, label: 'Menu', path: '/restaurant/menu' },
    { icon: FiShoppingBag, label: 'Commandes', path: '/restaurant/orders' },
    { icon: FiBell, label: 'Annonces', path: '/restaurant/announcements' },
    { icon: FiBarChart2, label: 'Statistiques', path: '/restaurant/stats' },
    { icon: FiSettings, label: 'Paramètres', path: '/restaurant/settings' },
  ];

  const adminMenu = [
    { icon: FiBarChart2, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: FiMapPin, label: 'Restaurants', path: '/admin/restaurants' },
    { icon: FiCreditCard, label: 'Abonnements', path: '/admin/subscriptions' },
    { icon: FiUsers, label: 'Utilisateurs', path: '/admin/users' },
  ];

  const menuItems = role === 'client' ? clientMenu : role === 'restaurant' ? restaurantMenu : adminMenu;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold text-orange-800">TOP 360°</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <nav className="p-4 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-orange-500 text-white font-medium shadow-md'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={() => { logout(); navigate('/'); }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 w-full"
              >
                <FiLogOut className="w-5 h-5" />
                Déconnexion
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Sidebar desktop */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-white border-r border-gray-200">
        <div className="flex items-center h-16 px-6 border-b">
          <Link to="/" className="text-xl font-bold text-orange-800">TOP 360°</Link>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-orange-100 text-orange-800 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-orange-700 flex items-center justify-center text-white text-sm font-medium">
              {user?.fullname?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.fullname}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="p-2 rounded-lg hover:bg-red-50 text-red-500"
              title="Déconnexion"
            >
              <FiLogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-72 flex-1">
        {/* Top bar mobile */}
        <div className="sticky top-0 z-30 lg:hidden bg-white border-b px-4 h-16 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <FiMenu className="w-6 h-6" />
          </button>
          <Link to="/" className="text-lg font-bold text-orange-800">TOP 360°</Link>
          <div className="w-10 h-10 rounded-full bg-orange-700 flex items-center justify-center text-white text-sm font-medium">
            {user?.fullname?.[0]?.toUpperCase()}
          </div>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
