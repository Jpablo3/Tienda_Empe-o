import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstall, setShowInstall] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Verificar si ya está instalada (modo standalone)
    const isInStandaloneMode = window.matchMedia('(display-mode: standalone)').matches ||
                               window.navigator.standalone ||
                               document.referrer.includes('android-app://');

    setIsStandalone(isInStandaloneMode);

    // Si no está instalada, mostrar el botón después de 3 segundos
    if (!isInStandaloneMode) {
      const timer = setTimeout(() => {
        setShowInstall(true);
      }, 3000);

      // Limpiar timeout si el componente se desmonta
      return () => clearTimeout(timer);
    }

    // Escuchar el evento beforeinstallprompt
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Si hay prompt nativo disponible, usarlo
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('Usuario aceptó la instalación de la PWA');
      }

      setDeferredPrompt(null);
      setShowInstall(false);
    } else {
      // Si no hay prompt nativo, mostrar instrucciones
      alert(
        'Para instalar esta app:\n\n' +
        'Chrome Android: Menú (⋮) → "Agregar a pantalla de inicio"\n\n' +
        'Safari iOS: Botón Compartir (□↑) → "Agregar a pantalla de inicio"'
      );
    }
  };

  const handleClose = () => {
    setShowInstall(false);
    // Guardar timestamp de cuando cerró el banner (para mostrarlo nuevamente después de 30 minutos)
    const dismissedTime = Date.now();
    localStorage.setItem('pwa-install-dismissed', dismissedTime.toString());
  };

  // Verificar si ya pasaron 30 minutos desde que cerró el banner
  const checkDismissed = () => {
    const dismissedTime = localStorage.getItem('pwa-install-dismissed');
    if (!dismissedTime) return false;

    const timeElapsed = Date.now() - parseInt(dismissedTime);
    const thirtyMinutes = 30 * 60 * 1000; // 30 minutos en milisegundos

    // Si pasaron más de 30 minutos, limpiar el localStorage y permitir mostrar
    if (timeElapsed > thirtyMinutes) {
      localStorage.removeItem('pwa-install-dismissed');
      return false;
    }

    return true;
  };

  // No mostrar si ya está instalada o si no han pasado 30 minutos desde que cerró
  if (isStandalone || checkDismissed()) {
    return null;
  }

  if (!showInstall) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 max-w-sm border border-gray-200 dark:border-gray-700 z-50">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
            Instalar Aplicación
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
            Instala nuestra app para acceso rápido y funcionalidad offline
          </p>
          <button
            onClick={handleInstallClick}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <Download size={18} />
            Instalar Ahora
          </button>
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
