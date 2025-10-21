import { useRef, useState, useEffect } from 'react';
import { X, Eraser, Check, PenTool } from 'lucide-react';

const ModalFirmaDigital = ({ onConfirm, onClose }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    // Configurar canvas (tamaño reducido para menor peso en Base64)
    canvas.width = 400;
    canvas.height = 150;

    // Fondo blanco
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Línea de firma
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(550, 250);
    ctx.stroke();

    // Texto guía
    ctx.fillStyle = '#999';
    ctx.font = '16px Arial';
    ctx.fillText('Firme aquí', 260, 270);

    // Configurar estilo de dibujo
    ctx.strokeStyle = '#1e40af'; // Azul oscuro
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    setIsDrawing(true);
    setIsEmpty(false);

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Soporte para touch (móviles)
  const startDrawingTouch = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    setIsDrawing(true);
    setIsEmpty(false);

    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const drawTouch = (e) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');

    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const limpiarFirma = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Limpiar todo
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Redibujar línea de firma
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(550, 250);
    ctx.stroke();

    // Redibujar texto guía
    ctx.fillStyle = '#999';
    ctx.font = '16px Arial';
    ctx.fillText('Firme aquí', 260, 270);

    // Restaurar estilo de dibujo
    ctx.strokeStyle = '#1e40af';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    setIsEmpty(true);
  };

  const confirmarFirma = () => {
    if (isEmpty) {
      alert('Por favor, firme en el recuadro antes de continuar');
      return;
    }

    const canvas = canvasRef.current;

    // Crear un canvas temporal más pequeño
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 200;  // Muy pequeño para reducir tamaño
    tempCanvas.height = 100;
    const tempCtx = tempCanvas.getContext('2d');

    // Dibujar la firma escalada en el canvas temporal
    tempCtx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, 200, 100);

    // Convertir a JPEG con muy baja calidad (reduce tamaño drásticamente)
    const firmaBase64 = tempCanvas.toDataURL('image/jpeg', 0.3);

    // Verificar tamaño
    if (firmaBase64.length > 50000) {
      alert('La firma es demasiado compleja. Por favor, firma de manera más simple.');
      return;
    }

    onConfirm(firmaBase64);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full">
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
          <p className="text-gray-600 mb-4">
            Por favor, dibuja tu firma en el recuadro usando el mouse o tu dedo (en dispositivos táctiles)
          </p>

          {/* Canvas de firma */}
          <div className="border-4 border-purple-200 rounded-xl overflow-hidden mb-4 bg-white">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawingTouch}
              onTouchMove={drawTouch}
              onTouchEnd={stopDrawing}
              className="cursor-crosshair w-full"
              style={{ touchAction: 'none' }}
            />
          </div>

          {/* Botones de acción */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={limpiarFirma}
              className="bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <Eraser className="w-5 h-5" />
              <span>Limpiar</span>
            </button>

            <button
              onClick={confirmarFirma}
              disabled={isEmpty}
              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Check className="w-5 h-5" />
              <span>Confirmar Firma</span>
            </button>
          </div>

          {/* Advertencia */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>Importante:</strong> Al firmar este contrato, aceptas los términos y condiciones del préstamo.
              Esta firma tiene validez legal.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalFirmaDigital;
