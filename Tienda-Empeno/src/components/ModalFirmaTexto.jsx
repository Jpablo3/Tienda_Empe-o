import { useState } from 'react';
import { X, Check, PenTool } from 'lucide-react';

const ModalFirmaTexto = ({ onConfirm, onClose }) => {
  const [nombreCompleto, setNombreCompleto] = useState('');

  const handleConfirmar = () => {
    if (!nombreCompleto.trim()) {
      alert('Por favor, ingresa tu nombre completo');
      return;
    }

    if (nombreCompleto.trim().length < 5) {
      alert('El nombre debe tener al menos 5 caracteres');
      return;
    }

    // Enviar solo el texto (cabe perfectamente en 255 caracteres)
    onConfirm(nombreCompleto.trim());
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <PenTool className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Firma Digital</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <p className="text-gray-600 mb-6">
            Para firmar el contrato, por favor ingresa tu nombre completo tal como aparece en tu documento de identidad.
          </p>

          {/* Input de nombre */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={nombreCompleto}
              onChange={(e) => setNombreCompleto(e.target.value)}
              placeholder="Juan Carlos Pérez López"
              className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              maxLength={255}
            />
            <p className="text-xs text-gray-500 mt-2">
              {nombreCompleto.length}/255 caracteres
            </p>
          </div>

          {/* Preview de la firma */}
          {nombreCompleto.trim() && (
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
              <p className="text-sm text-gray-600 mb-2">Vista previa de tu firma:</p>
              <p className="text-3xl font-serif italic text-purple-900">
                {nombreCompleto}
              </p>
            </div>
          )}

          {/* Botones */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all"
            >
              Cancelar
            </button>

            <button
              onClick={handleConfirmar}
              disabled={!nombreCompleto.trim()}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              <span>Confirmar Firma</span>
            </button>
          </div>

          {/* Advertencia legal */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Al firmar este contrato digitalmente con tu nombre,
              aceptas los términos y condiciones del préstamo. Esta firma tiene validez legal
              y es equivalente a una firma manuscrita.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalFirmaTexto;
