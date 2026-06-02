import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Pages publiques
import Home from './pages/Home';
import RestaurantDetail from './pages/RestaurantDetail';
import SearchResults from './pages/SearchResults';
import MapView from './pages/MapView';

// Auth
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Client
import ClientOrders from './pages/client/ClientOrders';
import ClientOrderDetail from './pages/client/ClientOrderDetail';
import ClientProfile from './pages/client/ClientProfile';
import Cart from './pages/client/Cart';

// Restaurant
import RestaurantDashboard from './pages/restaurant/RestaurantDashboard';
import RestaurantMenu from './pages/restaurant/RestaurantMenu';
import RestaurantOrders from './pages/restaurant/RestaurantOrders';
import RestaurantSettings from './pages/restaurant/RestaurantSettings';
import RestaurantStats from './pages/restaurant/RestaurantStats';
import RestaurantAnnouncements from './pages/restaurant/RestaurantAnnouncements';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRestaurants from './pages/admin/AdminRestaurants';
import AdminSubscriptions from './pages/admin/AdminSubscriptions';
import AdminUsers from './pages/admin/AdminUsers';

function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
}

export default function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Routes publiques */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:slug" element={<RestaurantDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/map" element={<MapView />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      </Route>

      {/* Espace Client */}
      <Route
        element={
          <ProtectedRoute roles={['client']}>
            <DashboardLayout role="client" />
          </ProtectedRoute>
        }
      >
        <Route path="/client/orders" element={<ClientOrders />} />
        <Route path="/client/orders/:id" element={<ClientOrderDetail />} />
        <Route path="/client/profile" element={<ClientProfile />} />
        <Route path="/cart" element={<Cart />} />
      </Route>

      {/* Espace Restaurant */}
      <Route
        element={
          <ProtectedRoute roles={['restaurant']}>
            <DashboardLayout role="restaurant" />
          </ProtectedRoute>
        }
      >
        <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
        <Route path="/restaurant/menu" element={<RestaurantMenu />} />
        <Route path="/restaurant/orders" element={<RestaurantOrders />} />
        <Route path="/restaurant/settings" element={<RestaurantSettings />} />
        <Route path="/restaurant/stats" element={<RestaurantStats />} />
        <Route path="/restaurant/announcements" element={<RestaurantAnnouncements />} />
      </Route>

      {/* Espace Admin */}
      <Route
        element={
          <ProtectedRoute roles={['admin']}>
            <DashboardLayout role="admin" />
          </ProtectedRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/restaurants" element={<AdminRestaurants />} />
        <Route path="/admin/subscriptions" element={<AdminSubscriptions />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}
