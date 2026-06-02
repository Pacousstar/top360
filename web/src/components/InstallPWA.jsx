import { useState, useEffect } from 'react';
import { FiDownload, FiX, FiSmartphone, FiCheck } from 'react-icons/fi';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [show, setShow] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [installing, setInstalling] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    setIsIOS(/iPad|iPhone|iPod/.test(ua) && !window.MSStream);

    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    const media = window.matchMedia('(display-mode: standalone)');
    if (media.matches) setIsInstalled(true);
    media.addEventListener('change', (e) => setIsInstalled(e.matches));

    if (window.navigator.standalone) setIsInstalled(true);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setInstalling(true);
    deferredPrompt.prompt();
    const result = await deferredPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setShow(false);
      setIsInstalled(true);
    }
    setDeferredPrompt(null);
    setInstalling(false);
  };

  if (isInstalled) return null;

  if (showGuide) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-gray-900">Installer TOP 360°</h4>
            <button onClick={() => setShowGuide(false)} className="p-1 text-gray-400 hover:text-gray-600">
              <FiX className="w-5 h-5" />
            </button>
          </div>
          {isIOS ? (
            <ol className="text-sm text-gray-600 space-y-2">
              <li>1. Tapez sur <strong>Partager</strong> <span className="text-blue-500">⬆️</span></li>
              <li>2. Scrollez et tapez <strong>Sur l'écran d'accueil</strong></li>
              <li>3. Tapez <strong>Ajouter</strong> en haut à droite</li>
            </ol>
          ) : (
            <ol className="text-sm text-gray-600 space-y-2">
              <li>1. Ouvrez le menu Chrome <span className="text-gray-400">⋮</span></li>
              <li>2. Tapez <strong>Installer l'application</strong></li>
              <li>3. Tapez <strong>Installer</strong></li>
            </ol>
          )}
        </div>
      </div>
    );
  }

  if (!show && !deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
        <button
          onClick={() => setShowGuide(true)}
          className="w-full bg-white rounded-2xl shadow-2xl border border-orange-200 p-4 flex items-center gap-3 hover:bg-orange-50 transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-600 to-red-500 flex items-center justify-center text-white font-bold text-xs shrink-0">
            360
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-gray-900">Installer TOP 360°</p>
            <p className="text-xs text-gray-500">Accès rapide depuis votre écran d'accueil</p>
          </div>
          <FiSmartphone className="w-5 h-5 text-orange-600 shrink-0" />
        </button>
      </div>
    );
  }

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
          disabled={installing}
          className="shrink-0 px-4 py-2 bg-orange-700 text-white text-sm font-semibold rounded-xl hover:bg-orange-800 transition-all flex items-center gap-1.5 disabled:opacity-60"
        >
          {installing ? (
            <FiSmartphone className="w-4 h-4 animate-pulse" />
          ) : (
            <FiDownload className="w-4 h-4" />
          )}
          {installing ? 'Confirmez...' : 'Installer'}
        </button>
        <button
          onClick={() => setShow(false)}
          className="shrink-0 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-gray-500 text-center mt-1.5">
        Après avoir cliqué, confirmez l'installation dans la fenêtre qui s'affiche
      </p>
    </div>
  );
}
