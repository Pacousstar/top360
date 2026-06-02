import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { menuAPI } from '../../services/api';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft } from 'react-icons/fi';

export default function RestaurantMenu() {
  const { restaurant } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');
  const [newItem, setNewItem] = useState({
    category_id: '', name: '', description: '', base_price: '', image: '',
    cooking_types: [], spice_levels: [], accompaniments: [],
  });
  const [showNewItem, setShowNewItem] = useState(false);

  useEffect(() => {
    if (restaurant) loadMenu();
  }, [restaurant]);

  const loadMenu = async () => {
    try {
      const res = await menuAPI.getMenu(restaurant.id);
      setCategories(res.data.categories || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await menuAPI.createCategory({ restaurant_id: restaurant.id, name: newCategory });
      setNewCategory('');
      loadMenu();
      toast.success('Catégorie ajoutée');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const deleteCategory = async (id) => {
    try {
      await menuAPI.deleteCategory(id);
      loadMenu();
      toast.success('Catégorie supprimée');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const addItem = async () => {
    if (!newItem.name || !newItem.base_price) {
      toast.error('Nom et prix requis');
      return;
    }
    try {
      await menuAPI.createItem({
        restaurant_id: restaurant.id,
        ...newItem,
        base_price: parseInt(newItem.base_price),
      });
      setNewItem({ category_id: '', name: '', description: '', base_price: '', image: '', cooking_types: [], spice_levels: [], accompaniments: [] });
      setShowNewItem(false);
      loadMenu();
      toast.success('Plat ajouté');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const toggleItem = async (id) => {
    try {
      await menuAPI.toggleItem(id);
      loadMenu();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const deleteItem = async (id) => {
    try {
      await menuAPI.deleteItem(id);
      loadMenu();
      toast.success('Plat supprimé');
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const toggleArrayField = (field, value) => {
    setNewItem(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value],
    }));
  };

  if (!restaurant) return <p className="text-center py-8">Aucun restaurant associé</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gestion du menu</h1>
        <button onClick={() => setShowNewItem(true)} className="btn-primary flex items-center gap-2 text-sm">
          <FiPlus /> Ajouter un plat
        </button>
      </div>

      {/* Nouvelle catégorie */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Nouvelle catégorie..."
          className="input-field flex-1"
        />
        <button onClick={addCategory} className="btn-primary">Ajouter</button>
      </div>

      {/* Nouvel item modal */}
      {showNewItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">Nouveau plat</h2>
            <div className="space-y-3">
              <select
                value={newItem.category_id}
                onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value })}
                className="input-field"
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input
                type="text"
                placeholder="Nom du plat"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                className="input-field"
              />
              <textarea
                placeholder="Description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="input-field"
              />
              <input
                type="number"
                placeholder="Prix (FCFA)"
                value={newItem.base_price}
                onChange={(e) => setNewItem({ ...newItem, base_price: e.target.value })}
                className="input-field"
              />
              <div>
                <label className="block text-sm font-medium mb-1">Image (URL)</label>
                <div className="flex items-center gap-3">
                  {newItem.image && <img src={newItem.image} alt="" className="w-14 h-14 rounded-xl object-cover border" />}
                  <input
                    type="text"
                    placeholder="https://exemple.com/plat.jpg"
                    value={newItem.image}
                    onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                    className="input-field flex-1"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Types de cuisson</label>
                <div className="flex flex-wrap gap-2">
                  {['grillé', 'sauce', 'braisé', 'patte'].map(t => (
                    <button
                      key={t}
                      onClick={() => toggleArrayField('cooking_types', t)}
                      className={`px-3 py-1 rounded-lg text-sm border ${newItem.cooking_types.includes(t) ? 'bg-orange-100 border-orange-500 text-orange-700' : 'bg-gray-50 border-gray-200'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={addItem} className="btn-primary flex-1">Ajouter</button>
                <button onClick={() => setShowNewItem(false)} className="btn-outline flex-1">Annuler</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Liste des catégories */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-orange-500 border-t-transparent mx-auto" />
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map(cat => (
            <div key={cat.id} className="card">
              <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-lg">{cat.name}</h3>
                <button onClick={() => deleteCategory(cat.id)} className="text-red-500 hover:bg-red-50 p-2 rounded-lg">
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="divide-y">
                {cat.menu_items?.map(item => (
                  <div key={item.id} className="p-4 flex items-center gap-3">
                    {item.image && <img src={item.image} alt="" className="w-14 h-14 rounded-xl object-cover border flex-shrink-0" />}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.is_available ? 'bg-orange-500' : 'bg-red-500'}`} />
                        <span className="font-medium truncate">{item.name}</span>
                        <span className="text-orange-700 font-semibold whitespace-nowrap">{item.base_price?.toLocaleString()} FCFA</span>
                      </div>
                      {item.description && <p className="text-sm text-gray-500 mt-0.5 truncate">{item.description}</p>}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => toggleItem(item.id)} className="p-2 hover:bg-gray-100 rounded-lg" title="Activer/Désactiver">
                        <FiToggleLeft className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {(!cat.menu_items || cat.menu_items.length === 0) && (
                  <p className="p-4 text-sm text-gray-400 text-center">Aucun plat dans cette catégorie</p>
                )}
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg mb-2">Votre menu est vide</p>
              <p>Ajoutez des catégories et des plats</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
