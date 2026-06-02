import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold text-orange-800">TOP 360°</h1>
              <p className="text-sm text-gray-500 mt-1">Plateforme digitale des commerces</p>
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
