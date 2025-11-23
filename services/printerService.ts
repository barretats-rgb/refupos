import { OrderItem, Printer } from '../types';

/**
 * Constructs the ePOS-Print XML envelope for the Epson TM series.
 * Includes standard XML declaration and correct SOAP namespaces.
 */
const buildXml = (content: string) => {
  return `<?xml version="1.0" encoding="utf-8"?>
<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/">
    <s:Body>
        <epos-print xmlns="http://www.epson-pos.com/schemas/2011/03/epos-print">
            ${content}
        </epos-print>
    </s:Body>
</s:Envelope>`;
};

const sendToPrinter = async (ip: string, xmlData: string): Promise<{ success: boolean; message: string }> => {
  // Standard ePOS endpoint
  const url = `http://${ip}/cgi-bin/epos/service.cgi?devid=local_printer&timeout=5000`;
  
  try {
    // TRUCO DE SEGURIDAD (Bypass CORS Preflight):
    // Cambiamos el Content-Type a 'text/plain'.
    // Los navegadores permiten enviar text/plain sin hacer la pregunta de seguridad (OPTIONS preflight)
    // que suele bloquear las conexiones a redes locales (PNA).
    // Las impresoras Epson inteligentes suelen ser capaces de leer el XML dentro del cuerpo 
    // aunque la cabecera diga que es texto plano.
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain; charset=utf-8', 
      },
      body: xmlData,
      credentials: 'omit',
      mode: 'no-cors', 
    });

    // Con no-cors, no podemos leer response.ok. Siempre retornamos éxito si no hay excepción de red.
    return { success: true, message: 'Enviado (Modo Sin Confirmación)' };

  } catch (error: any) {
    console.error('Print Error:', error);
    
    let msg = 'Error de conexión';
    if (error.message === 'Failed to fetch') {
       msg = 'Bloqueo de Red (PNA/CORS)';
       console.warn("IMPORTANTE: Revise la configuración de 'Insecure Private Network Requests' en chrome://flags");
    }

    return { 
      success: false, 
      message: msg
    };
  }
};

export const printTestTicket = async (printer: Printer) => {
  const content = `
    <text lang="en"/>
    <text align="center" font="font_a" smooth="true" dw="true" dh="true">REFUGIO POS&#10;</text>
    <text align="center">Prueba de Conexion&#10;</text>
    <text align="center">------------------------------------------&#10;</text>
    <feed line="1"/>
    <text align="left">Impresora: ${printer.name}&#10;</text>
    <text align="left">IP: ${printer.ip}&#10;</text>
    <text align="left">Estado: OK&#10;</text>
    <feed line="2"/>
    <text align="center">Conexion Exitosa!&#10;</text>
    <feed line="3"/>
    <cut type="feed"/>
  `;
  
  return sendToPrinter(printer.ip, buildXml(content));
};

export const printOrderTicket = async (
  printer: Printer, 
  items: OrderItem[], 
  tableName: string, 
  orderId: string,
  type: 'KITCHEN' | 'BAR' | 'RECEIPT'
): Promise<{ success: boolean; message: string }> => {
  
  const date = new Date().toLocaleTimeString('es-CR');
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // XML Construction
  let xmlBody = `
    <text lang="en"/>
    <text align="center" font="font_a" smooth="true" dw="true" dh="true">REFUGIO POS&#10;</text>
    <text align="center" font="font_b">${type === 'RECEIPT' ? 'FACTURA' : type === 'KITCHEN' ? 'COCINA' : 'BARRA'}&#10;</text>
    <text align="center">------------------------------------------&#10;</text>
    <text align="left">Mesa: ${tableName}&#10;</text>
    <text align="left">Orden: #${orderId}&#10;</text>
    <text align="left">Hora: ${date}&#10;</text>
    <feed line="1"/>
  `;

  if (type === 'RECEIPT') {
      xmlBody += `<text align="left">Cant.  Desc.                 Total&#10;</text>`;
      xmlBody += `<text align="left">------------------------------------------&#10;</text>`;
  }

  items.forEach(item => {
    // Sanitize for XML (simple escape)
    const safeName = item.name.replace(/[<>&'"]/g, ''); 
    
    if (type === 'RECEIPT') {
       const lineTotal = item.price * item.quantity;
       // Basic formatting padding
       const qty = item.quantity.toString().padEnd(4);
       const name = safeName.substring(0, 18).padEnd(20);
       xmlBody += `<text align="left">${qty} ${name} ${lineTotal}&#10;</text>`;
    } else {
       xmlBody += `<text align="left" font="font_b" dw="true" dh="true">[ ] ${item.quantity}x ${safeName}&#10;</text>`;
    }
  });

  xmlBody += `<feed line="1"/>`;
  xmlBody += `<text align="center">------------------------------------------&#10;</text>`;

  if (type === 'RECEIPT') {
    xmlBody += `<text align="right" font="font_a" dw="true" dh="true">TOTAL: C${total}&#10;</text>`;
    xmlBody += `<feed line="2"/>`;
    xmlBody += `<text align="center">Gracias por su visita!&#10;</text>`;
  }

  xmlBody += `<feed line="3"/>`;
  xmlBody += `<cut type="feed"/>`;

  return sendToPrinter(printer.ip, buildXml(xmlBody));
};