import jsPDF from 'jspdf';

/**
 * Genera un PDF de contrato de préstamo con las políticas de la tienda
 * @param {Object} datos - Datos del contrato
 * @param {string} datos.nombreCliente - Nombre completo del cliente
 * @param {string} datos.dpi - DPI del cliente
 * @param {string} datos.nombreArticulo - Nombre del artículo en garantía
 * @param {number} datos.montoPrestamo - Monto del préstamo
 * @param {number} datos.tasaInteres - Tasa de interés mensual
 * @param {number} datos.plazoMeses - Plazo en meses
 * @param {string} datos.fechaInicio - Fecha de inicio del contrato
 * @param {string} datos.fechaVencimiento - Fecha de vencimiento
 * @param {number} datos.saldoAdeudado - Saldo total a pagar
 */
export const generarContratoPDF = (datos) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - (margin * 2);
  let yPosition = margin;

  // ========== ENCABEZADO ==========
  doc.setFillColor(124, 58, 237); // Morado
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('CONTRATO DE PRÉSTAMO PRENDARIO', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Tienda de Empeño - Guatemala', pageWidth / 2, 30, { align: 'center' });

  yPosition = 55;

  // ========== INFORMACIÓN DEL CONTRATO ==========
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const fechaEmision = new Date().toLocaleDateString('es-GT', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  doc.text(`Fecha de emisión: ${fechaEmision}`, margin, yPosition);
  yPosition += 15;

  // ========== DATOS DEL CLIENTE ==========
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPosition, maxWidth, 25, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL CLIENTE', margin + 5, yPosition + 8);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nombre: ${datos.nombreCliente}`, margin + 5, yPosition + 15);
  doc.text(`DPI: ${datos.dpi}`, margin + 5, yPosition + 22);

  yPosition += 35;

  // ========== DATOS DEL PRÉSTAMO ==========
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPosition, maxWidth, 40, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('DATOS DEL PRÉSTAMO', margin + 5, yPosition + 8);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Artículo en Garantía: ${datos.nombreArticulo}`, margin + 5, yPosition + 15);
  doc.text(`Monto del Préstamo: Q${parseFloat(datos.montoPrestamo).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`, margin + 5, yPosition + 22);
  doc.text(`Tasa de Interés: ${parseFloat(datos.tasaInteres).toFixed(1)}% mensual`, margin + 5, yPosition + 29);
  doc.text(`Plazo: ${datos.plazoMeses} ${datos.plazoMeses === 1 ? 'mes' : 'meses'}`, margin + 5, yPosition + 36);

  yPosition += 50;

  // ========== TÉRMINOS Y CONDICIONES ==========
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(124, 58, 237);
  doc.text('TÉRMINOS Y CONDICIONES', margin, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);

  // Verificar si necesitamos nueva página
  const verificarEspacio = (espacioNecesario) => {
    if (yPosition + espacioNecesario > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  };

  // 1. OBJETO DEL CONTRATO
  verificarEspacio(30);
  doc.text('1. OBJETO DEL CONTRATO', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  const texto1 = `El ACREEDOR otorga al DEUDOR un préstamo en efectivo por la cantidad de Q${parseFloat(datos.montoPrestamo).toLocaleString('es-GT', { minimumFractionDigits: 2 })}, dejando en prenda el artículo descrito: "${datos.nombreArticulo}". El DEUDOR se compromete a pagar el monto total adeudado de Q${parseFloat(datos.saldoAdeudado).toLocaleString('es-GT', { minimumFractionDigits: 2 })} antes de la fecha de vencimiento establecida.`;
  const lineas1 = doc.splitTextToSize(texto1, maxWidth);
  doc.text(lineas1, margin, yPosition);
  yPosition += lineas1.length * 5 + 8;

  // 2. INTERESES
  verificarEspacio(25);
  doc.setFont('helvetica', 'bold');
  doc.text('2. INTERESES', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  const texto2 = `El préstamo devengará un interés del ${parseFloat(datos.tasaInteres).toFixed(1)}% mensual sobre el saldo insoluto. Los intereses se calcularán sobre base mensual y se acumularán al saldo total adeudado.`;
  const lineas2 = doc.splitTextToSize(texto2, maxWidth);
  doc.text(lineas2, margin, yPosition);
  yPosition += lineas2.length * 5 + 8;

  // 3. PLAZO Y VENCIMIENTO
  verificarEspacio(25);
  doc.setFont('helvetica', 'bold');
  doc.text('3. PLAZO Y VENCIMIENTO', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  const texto3 = `El plazo del préstamo es de ${datos.plazoMeses} ${datos.plazoMeses === 1 ? 'mes' : 'meses'}, iniciando el ${new Date(datos.fechaInicio).toLocaleDateString('es-GT')} y venciendo el ${new Date(datos.fechaVencimiento).toLocaleDateString('es-GT')}. Al vencimiento del plazo, el DEUDOR deberá haber liquidado la totalidad del préstamo más los intereses acumulados.`;
  const lineas3 = doc.splitTextToSize(texto3, maxWidth);
  doc.text(lineas3, margin, yPosition);
  yPosition += lineas3.length * 5 + 8;

  // 4. PRENDA
  verificarEspacio(35);
  doc.setFont('helvetica', 'bold');
  doc.text('4. GARANTÍA PRENDARIA', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  const texto4 = `El DEUDOR deja en prenda el artículo descrito, el cual quedará bajo custodia del ACREEDOR hasta la liquidación total del préstamo. El ACREEDOR se compromete a mantener el artículo en condiciones adecuadas de almacenamiento. El DEUDOR declara ser el legítimo propietario del artículo empeñado y que no tiene gravámenes, embargos o limitaciones de dominio.`;
  const lineas4 = doc.splitTextToSize(texto4, maxWidth);
  doc.text(lineas4, margin, yPosition);
  yPosition += lineas4.length * 5 + 8;

  // 5. INCUMPLIMIENTO
  verificarEspacio(40);
  doc.setFont('helvetica', 'bold');
  doc.text('5. INCUMPLIMIENTO Y MORA', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  const texto5 = `En caso de que el DEUDOR no liquide la totalidad del préstamo al vencimiento del plazo establecido, el ACREEDOR podrá: a) Extender el plazo mediante acuerdo mutuo con recalculación de intereses, b) Vender el artículo empeñado en subasta pública o privada para recuperar el monto adeudado. Si el producto de la venta excede el monto adeudado, el remanente será devuelto al DEUDOR. Si es insuficiente, el DEUDOR seguirá obligado a pagar la diferencia.`;
  const lineas5 = doc.splitTextToSize(texto5, maxWidth);
  doc.text(lineas5, margin, yPosition);
  yPosition += lineas5.length * 5 + 8;

  // Nueva página para políticas adicionales
  doc.addPage();
  yPosition = margin;

  // 6. RENOVACIÓN Y EXTENSIÓN
  doc.setFont('helvetica', 'bold');
  doc.text('6. RENOVACIÓN Y EXTENSIÓN', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  const texto6 = `El DEUDOR podrá solicitar una extensión del plazo hasta 7 días antes del vencimiento, pagando los intereses acumulados. La extensión estará sujeta a aprobación del ACREEDOR y podrá implicar ajustes en la tasa de interés según las condiciones del mercado.`;
  const lineas6 = doc.splitTextToSize(texto6, maxWidth);
  doc.text(lineas6, margin, yPosition);
  yPosition += lineas6.length * 5 + 8;

  // 7. RESCATE
  doc.setFont('helvetica', 'bold');
  doc.text('7. RESCATE DEL ARTÍCULO', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  const texto7 = `El DEUDOR podrá rescatar el artículo empeñado en cualquier momento antes del vencimiento del contrato, pagando el capital más los intereses acumulados hasta la fecha de pago. El rescate deberá realizarse en las instalaciones del ACREEDOR presentando este contrato y documento de identificación válido.`;
  const lineas7 = doc.splitTextToSize(texto7, maxWidth);
  doc.text(lineas7, margin, yPosition);
  yPosition += lineas7.length * 5 + 8;

  // 8. RESPONSABILIDAD
  doc.setFont('helvetica', 'bold');
  doc.text('8. RESPONSABILIDAD Y CUSTODIA', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  const texto8 = `El ACREEDOR se responsabiliza por la custodia adecuada del artículo empeñado, manteniéndolo en condiciones de seguridad. No obstante, el ACREEDOR no será responsable por daños causados por fuerza mayor, caso fortuito, fenómenos naturales, incendios, robos con violencia, o cualquier evento fuera de su control razonable.`;
  const lineas8 = doc.splitTextToSize(texto8, maxWidth);
  doc.text(lineas8, margin, yPosition);
  yPosition += lineas8.length * 5 + 8;

  // 9. PRIVACIDAD
  doc.setFont('helvetica', 'bold');
  doc.text('9. PROTECCIÓN DE DATOS PERSONALES', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  const texto9 = `El DEUDOR autoriza al ACREEDOR a recopilar, almacenar y procesar sus datos personales exclusivamente para fines relacionados con este contrato. Los datos no serán compartidos con terceros salvo requerimiento legal o autorización expresa del DEUDOR.`;
  const lineas9 = doc.splitTextToSize(texto9, maxWidth);
  doc.text(lineas9, margin, yPosition);
  yPosition += lineas9.length * 5 + 8;

  // 10. JURISDICCIÓN
  doc.setFont('helvetica', 'bold');
  doc.text('10. JURISDICCIÓN Y LEY APLICABLE', margin, yPosition);
  yPosition += 7;
  doc.setFont('helvetica', 'normal');
  const texto10 = `Este contrato se rige por las leyes de la República de Guatemala. Cualquier controversia derivada de este contrato será resuelta en los tribunales competentes de Guatemala, renunciando las partes a cualquier otro fuero que pudiera corresponderles.`;
  const lineas10 = doc.splitTextToSize(texto10, maxWidth);
  doc.text(lineas10, margin, yPosition);
  yPosition += lineas10.length * 5 + 15;

  // ========== RESUMEN FINANCIERO ==========
  doc.setFillColor(240, 240, 240);
  doc.rect(margin, yPosition, maxWidth, 35, 'F');

  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(124, 58, 237);
  doc.text('RESUMEN FINANCIERO', margin + 5, yPosition + 8);

  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Monto Prestado: Q${parseFloat(datos.montoPrestamo).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`, margin + 5, yPosition + 16);
  doc.text(`Intereses: ${parseFloat(datos.tasaInteres).toFixed(1)}% mensual`, margin + 5, yPosition + 23);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL A PAGAR: Q${parseFloat(datos.saldoAdeudado).toLocaleString('es-GT', { minimumFractionDigits: 2 })}`, margin + 5, yPosition + 30);

  yPosition += 50;

  // ========== FIRMA ==========
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);

  doc.text('En prueba de conformidad, las partes firman el presente contrato:', margin, yPosition);
  yPosition += 20;

  // Líneas de firma
  const lineaY = yPosition;
  const lineaWidth = 60;

  // Firma del cliente
  doc.line(margin, lineaY, margin + lineaWidth, lineaY);
  doc.text('Firma del Deudor', margin, lineaY + 7);
  doc.setFont('helvetica', 'bold');
  doc.text(datos.nombreCliente, margin, lineaY + 14);
  doc.setFont('helvetica', 'normal');
  doc.text(`DPI: ${datos.dpi}`, margin, lineaY + 21);

  // Firma del acreedor
  const rightX = pageWidth - margin - lineaWidth;
  doc.line(rightX, lineaY, rightX + lineaWidth, lineaY);
  doc.text('Firma del Acreedor', rightX, lineaY + 7);
  doc.setFont('helvetica', 'bold');
  doc.text('Tienda de Empeño', rightX, lineaY + 14);
  doc.setFont('helvetica', 'normal');
  doc.text('Guatemala', rightX, lineaY + 21);

  // ========== PIE DE PÁGINA ==========
  const footerY = pageHeight - 15;
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('Este documento es legalmente vinculante. Conserve una copia para sus registros.', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Generado el ${fechaEmision}`, pageWidth / 2, footerY + 5, { align: 'center' });

  return doc;
};

/**
 * Descarga el PDF del contrato
 */
export const descargarContratoPDF = (datos) => {
  const doc = generarContratoPDF(datos);
  const nombreArchivo = `Contrato_${datos.nombreCliente.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`;
  doc.save(nombreArchivo);
};
