import { useState, useRef } from 'react';
import { uploadAPI } from '../services/api';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiLoader } from 'react-icons/fi';

export default function ImageUpload({ currentUrl, onUpload, label, className }) {
  const [preview, setPreview] = useState(currentUrl || '');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Fichier trop volumineux (max 5MB)');
      return;
    }

    setUploading(true);
    try {
      const res = await uploadAPI.upload(file);
      const url = res.data.url;
      setPreview(url);
      onUpload(url);
    } catch (err) {
      console.error('Upload error:', err);
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const remove = () => {
    setPreview('');
    onUpload('');
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className || ''}`}>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="flex items-center gap-3">
        {preview ? (
          <div className="relative">
            <img src={preview} alt="" className="w-16 h-16 rounded-xl object-cover border" />
            <button
              type="button"
              onClick={remove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow"
            >
              <FiX className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
            <FiUpload className="w-5 h-5" />
          </div>
        )}
        <label className="cursor-pointer flex-1">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFile}
            className="hidden"
            disabled={uploading}
          />
          <div className={`input-field flex items-center justify-center gap-2 cursor-pointer ${uploading ? 'opacity-50' : ''}`}>
            {uploading ? (
              <><FiLoader className="w-4 h-4 animate-spin" /> Upload en cours...</>
            ) : (
              <><FiUpload className="w-4 h-4" /> {preview ? 'Changer' : 'Choisir une image'}</>
            )}
          </div>
        </label>
      </div>
    </div>
  );
}
