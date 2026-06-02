import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { searchAPI } from '../services/api';
import { FiSearch, FiMapPin } from 'react-icons/fi';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const module = searchParams.get('module') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    search();
  }, [q, module]);

  const search = async () => {
    setLoading(true);
    try {
      const params = {};
      if (q) params.q = q;
      if (module) params.module = module;
      const res = await searchAPI.search(params);
      setResults(res.data.results || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">
        {q ? `Résultats pour "${q}"` : module ? `Module ${module.replace('top_', '').toUpperCase()}` : 'Tous les commerces'}
      </h1>
      <p className="text-gray-500 mb-6">{results.length} résultat(s)</p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="card p-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {results.map(r => (
            <Link key={r.id} to={`/restaurant/${r.slug}`} className="card p-4 flex items-start gap-4 hover:bg-orange-50 transition-colors">
              <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                {r.logo ? <img src={r.logo} alt="" className="w-full h-full rounded-xl object-cover" /> : '🏪'}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{r.name}</h3>
                <p className="text-sm text-gray-500">{r.description || r.module?.replace('top_', '').toUpperCase()}</p>
                <div className="flex items-center gap-3 mt-1.5 text-xs">
                  {r.is_open ? (
                    <span className="badge-green">🟢 Ouvert</span>
                  ) : (
                    <span className="badge-red">🔴 Fermé</span>
                  )}
                  {r.avg_rating > 0 && <span>⭐ {r.avg_rating}</span>}
                  {r.city && <span className="text-gray-400 flex items-center gap-1"><FiMapPin className="w-3 h-3" />{r.city}</span>}
                </div>
              </div>
            </Link>
          ))}

          {results.length === 0 && (
            <div className="text-center py-12">
              <FiSearch className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun résultat trouvé</p>
              <p className="text-gray-400 text-sm">Essayez d'autres termes de recherche</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
