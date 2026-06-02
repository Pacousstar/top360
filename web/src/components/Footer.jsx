import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-orange-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-forest-500 mb-4">TOP 360°</h3>
            <p className="text-orange-200 text-sm">
              La plateforme digitale qui référence, organise et connecte l'ensemble des commerces et services locaux.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Plateformes</h4>
            <div className="grid grid-cols-5 gap-x-2 gap-y-1 text-sm text-orange-200">
              <span>🍽️ TOP DÉLICE</span>
              <span>🏗️ TOP BAT</span>
              <span>🏨 TOP HOTEL</span>
              <span>🛍️ TOP SHOP</span>
              <span>🚗 TOP AUTO</span>
              <span>🏥 TOP SANTÉ</span>
              <span>🎓 TOP ÉDUCATION</span>
              <span>🏠 TOP IMMO</span>
              <span>🎉 TOP EVENT</span>
              <span>⚖️ TOP SERVICES</span>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Liens utiles</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-orange-200 hover:text-white">Accueil</Link></li>
              <li><Link to="/map" className="text-orange-200 hover:text-white">Carte interactive</Link></li>
              <li><Link to="/register" className="text-orange-200 hover:text-white">Inscription</Link></li>
              <li><Link to="/login" className="text-orange-200 hover:text-white">Connexion</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-orange-200">
              <li>📧 contact@top360.ci</li>
              <li>📱 +225 05 44 81 49 24</li>
              <li>📍 Duékoué, Côte d'Ivoire</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-orange-800 mt-8 pt-8 text-center text-sm text-orange-300">
          <p>&copy; {new Date().getFullYear()} TOP 360° - Tous droits réservés. Construit avec ❤️ en Côte d'Ivoire 🇨🇮</p>
        </div>
      </div>
    </footer>
  );
}
