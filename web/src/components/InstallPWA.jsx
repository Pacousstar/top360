import { useState, useEffect } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const media = window.matchMedia('(display-mode: standalone)');
    if (media.matches) setIsInstalled(true);
    media.addEventListener('change', (e) => setIsInstalled(e.matches));

    const checkInstalled = () => {
      if (window.navigator.standalone) setIsInstalled(true);
    };
    checkInstalled();

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setShow(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
  };

  if (!show || isInstalled) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-orange-200 p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
          360
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900">Installer TOP 360°</p>
          <p className="text-xs text-gray-500">Accès rapide depuis votre écran d'accueil</p>
        </div>
        <button
          onClick={handleInstall}
          className="shrink-0 px-4 py-2 bg-orange-700 text-white text-sm font-semibold rounded-xl hover:bg-orange-800 transition-all flex items-center gap-1.5"
        >
          <FiDownload className="w-4 h-4" />
          Installer
        </button>
        <button
          onClick={() => setShow(false)}
          className="shrink-0 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
