import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { announcementAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

export default function RestaurantAnnouncements() {
  const { restaurant } = useAuth();
  const [announcements, setAnnouncements] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    if (restaurant) loadAnnouncements();
  }, [restaurant]);

  const loadAnnouncements = async () => {
    try {
      const res = await announcementAPI.list(restaurant.id);
      setAnnouncements(res.data.announcements || []);
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const addAnnouncement = async () => {
    if (!newTitle.trim()) return;
    try {
      await announcementAPI.create({ restaurant_id: restaurant.id, title: newTitle, content: newContent });
      setNewTitle('');
      setNewContent('');
      loadAnnouncements();
      toast.success('Annonce publiée !');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      await announcementAPI.delete(id);
      loadAnnouncements();
      toast.success('Annonce supprimée');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  if (!restaurant) return null;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Annonces</h1>

      <div className="card p-4 mb-6 space-y-3">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Titre de l'annonce (ex: Porc disponible 🔥)"
          className="input-field"
        />
        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Contenu (optionnel)"
          className="input-field"
          rows={2}
        />
        <button onClick={addAnnouncement} className="btn-primary flex items-center gap-2">
          <FiPlus /> Publier l'annonce
        </button>
      </div>

      <div className="space-y-3">
        {announcements.map(a => (
          <div key={a.id} className="card p-4 flex items-start justify-between">
            <div>
              <h3 className="font-medium">{a.title}</h3>
              {a.content && <p className="text-sm text-gray-500 mt-1">{a.content}</p>}
              <p className="text-xs text-gray-400 mt-1">{new Date(a.created_at).toLocaleString('fr-FR')}</p>
            </div>
            <button onClick={() => deleteAnnouncement(a.id)} className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
        {announcements.length === 0 && (
          <p className="text-center py-8 text-gray-500">Aucune annonce pour le moment</p>
        )}
      </div>
    </div>
  );
}
