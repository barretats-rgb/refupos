import React, { useState } from 'react';
import { Printer, Category, PrinterRoute } from '../types';
import { Printer as PrinterIcon, Wifi, RefreshCw, AlertCircle, Plus, Trash2, Server, FileText, ShieldAlert, HelpCircle, Copy } from 'lucide-react';

interface SettingsViewProps {
  printers: Printer[];
  onUpdatePrinters: (printers: Printer[]) => void;
  routes: PrinterRoute[];
  onUpdateRoutes: (routes: PrinterRoute[]) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
  printers, 
  onUpdatePrinters, 
  routes, 
  onUpdateRoutes 
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'printers'>('printers');
  const [isScanning, setIsScanning] = useState(false);
  const [manualIp, setManualIp] = useState('192.168.100.139'); // Default to the known IP
  const [showHelp, setShowHelp] = useState(false);
  const [printerForTest, setPrinterForTest] = useState<Printer | null>(null);

  const scanNetwork = () => {
    setIsScanning(true);
    // Simulating network discovery. In a real browser app, we can't scan subnets easily without a backend agent.
    // However, since we know the IP from the receipt, we can "find" it.
    setTimeout(() => {
      setIsScanning(false);
      
      const foundPrinter: Printer = {
        id: `p_auto_${Date.now()}`,
        name: 'Epson Barra (192.168.100.139)',
        ip: '192.168.100.139',
        model: 'Epson TM-T20III',
        status: 'online'
      };
      
      // Check if not exists
      if (!printers.find(p => p.ip === foundPrinter.ip)) {
        onUpdatePrinters([...printers, foundPrinter]);
        
        // Auto-assign drinks to this new printer
        const drinkCats = [Category.COCKTAILS, Category.WINES_BEERS, Category.SHOTS, Category.COFFEE, Category.NON_ALCOHOLIC];
        const newRoutes = routes.map(r => 
            drinkCats.includes(r.categoryId) ? { ...r, printerId: foundPrinter.id } : r
        );
        onUpdateRoutes(newRoutes);
      }
    }, 2000);
  };

  const addManualPrinter = () => {
    if (!manualIp) return;
    const newPrinter: Printer = {
        id: `p${Date.now()}`,
        name: `Impresora ${manualIp.split('.').pop()}`,
        ip: manualIp,
        model: 'Epson TM-T20III',
        status: 'online' 
    };
    onUpdatePrinters([...printers, newPrinter]);
  };

  const deletePrinter = (id: string) => {
    onUpdatePrinters(printers.filter(p => p.id !== id));
    // Reset routes if printer deleted
    onUpdateRoutes(routes.map(r => r.printerId === id ? { ...r, printerId: printers[0]?.id || '' } : r));
  };

  const updateRoute = (category: Category, printerId: string) => {
    onUpdateRoutes(routes.map(r => 
      r.categoryId === category ? { ...r, printerId } : r
    ));
  };

  const handleTestPrint = (printer: Printer) => {
    setPrinterForTest(printer);
    // Small delay to allow React to render the hidden ticket with the correct state before printing
    setTimeout(() => {
        window.print();
    }, 100);
  };

  // Group categories for cleaner UI
  const foodCategories = [Category.STARTERS, Category.BURGERS, Category.SANDWICHES, Category.SALADS, Category.HOT_DOGS, Category.CASADOS, Category.BRUNCH, Category.DESSERTS, Category.EXTRAS];
  const drinkCategories = [Category.COCKTAILS, Category.WINES_BEERS, Category.SHOTS, Category.COFFEE, Category.NON_ALCOHOLIC];

  return (
    <div className="flex h-full bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* Settings Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 p-6 hidden md:block">
        <h2 className="text-2xl font-bold mb-8 text-white">Ajustes</h2>
        
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('printers')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'printers' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <PrinterIcon size={20} />
            <div className="text-left">
              <div className="font-medium">Impresoras</div>
              <div className="text-[10px] opacity-70">Red & Perfiles</div>
            </div>
          </button>

          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'general' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
          >
            <Server size={20} />
            <div className="text-left">
              <div className="font-medium">General</div>
              <div className="text-[10px] opacity-70">Cuenta y Datos</div>
            </div>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        
        {activeTab === 'printers' && (
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Configuración de Impresión</h3>
                <p className="text-slate-400 text-sm">Gestiona las impresoras Epson TM-T20III.</p>
              </div>
              <button 
                onClick={() => setShowHelp(!showHelp)}
                className="flex items-center gap-2 text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors bg-amber-500/10 px-3 py-2 rounded-lg"
              >
                <HelpCircle size={18} />
                <span className="hidden sm:inline">{showHelp ? 'Ocultar Ayuda' : 'Ayuda'}</span>
              </button>
            </div>

            {/* Troubleshooting / Help Section */}
            {showHelp && (
              <div className="bg-amber-900/20 border border-amber-500/30 rounded-xl p-6 animate-in fade-in slide-in-from-top-4">
                <div className="flex items-start gap-3">
                  <ShieldAlert className="text-amber-500 shrink-0 mt-1" size={24} />
                  <div className="w-full">
                    <h4 className="text-amber-400 font-bold text-lg mb-2">Impresión en Android/iOS</h4>
                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                      Para garantizar la impresión sin errores de conexión (SSL/CORS), el sistema utiliza la 
                      <strong className="text-white ml-1">Impresión Nativa</strong> de tu tablet.
                    </p>
                    <div className="bg-emerald-900/40 border border-emerald-500/30 rounded-lg p-4 text-sm text-slate-200 mb-4">
                        <strong className="text-emerald-400 block mb-2">Cómo funciona:</strong>
                        <ul className="list-disc pl-4 space-y-1 text-xs text-slate-300">
                          <li>Al pulsar "Imprimir", se abrirá el diálogo del sistema.</li>
                          <li>Asegúrate de que tu tablet está conectada a la misma red WiFi que la impresora.</li>
                          <li>Selecciona la impresora Epson en el menú que aparece.</li>
                        </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Network Discovery Section */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-semibold flex items-center gap-2">
                  <Wifi size={18} className="text-emerald-500" />
                  Dispositivos
                </h4>
                <button 
                  onClick={scanNetwork}
                  disabled={isScanning}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm text-amber-500 transition-colors disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isScanning ? 'animate-spin' : ''} />
                  {isScanning ? 'Buscando...' : 'Buscar Impresoras'}
                </button>
              </div>

              {/* Printer List */}
              <div className="space-y-3">
                {printers.map(printer => (
                  <div key={printer.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800 group gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${printer.status === 'online' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                        <PrinterIcon size={24} />
                      </div>
                      <div>
                        <div className="font-medium text-white flex items-center gap-2">
                            {printer.name}
                            {printer.isDefault && <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded text-slate-300">Principal</span>}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5 flex gap-3">
                            <span>IP: {printer.ip}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                        <button 
                            onClick={() => handleTestPrint(printer)}
                            className="flex items-center gap-2 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-lg text-sm shadow-lg shadow-amber-500/20" 
                            title="Prueba nativa"
                        >
                            <FileText size={16} />
                            <span className="hidden sm:inline">Prueba</span>
                        </button>
                        <button 
                            onClick={() => deletePrinter(printer.id)}
                            className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </div>
                ))}

                {printers.length === 0 && !isScanning && (
                    <div className="text-center py-8 text-slate-500 text-sm">
                        No se encontraron impresoras.
                    </div>
                )}
              </div>

              {/* Manual Add */}
              <div className="mt-6 pt-6 border-t border-slate-800 flex items-end gap-3">
                 <div className="flex-1">
                    <label className="block text-xs text-slate-500 mb-1">Agregar manualmente por IP</label>
                    <input 
                        type="text" 
                        value={manualIp}
                        onChange={(e) => setManualIp(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono focus:border-amber-500 focus:outline-none"
                    />
                 </div>
                 <button 
                    onClick={addManualPrinter}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg flex items-center gap-2 text-sm"
                 >
                    <Plus size={16} /> Agregar
                 </button>
              </div>
            </div>

            {/* Printing Profiles (Routing) */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                        <Server size={20} />
                    </div>
                    <div>
                        <h4 className="font-semibold">Perfiles de Enrutamiento</h4>
                        <p className="text-xs text-slate-400">Decide dónde se imprime cada categoría.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Food Column */}
                    <div>
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">Comidas & Cocina</h5>
                        <div className="space-y-3">
                            {foodCategories.map(cat => {
                                const currentPrinterId = routes.find(r => r.categoryId === cat)?.printerId || '';
                                return (
                                    <div key={cat} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-300">{cat}</span>
                                        <select 
                                            value={currentPrinterId}
                                            onChange={(e) => updateRoute(cat, e.target.value)}
                                            className="bg-slate-950 border border-slate-700 text-white rounded px-2 py-1 text-xs w-40 focus:border-amber-500 outline-none"
                                        >
                                            <option value="">-- Seleccionar --</option>
                                            {printers.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Drinks Column */}
                    <div>
                        <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 border-b border-slate-800 pb-2">Bebidas & Barra</h5>
                        <div className="space-y-3">
                            {drinkCategories.map(cat => {
                                const currentPrinterId = routes.find(r => r.categoryId === cat)?.printerId || '';
                                return (
                                    <div key={cat} className="flex justify-between items-center text-sm">
                                        <span className="text-slate-300">{cat}</span>
                                        <select 
                                            value={currentPrinterId}
                                            onChange={(e) => updateRoute(cat, e.target.value)}
                                            className="bg-slate-950 border border-slate-700 text-white rounded px-2 py-1 text-xs w-40 focus:border-amber-500 outline-none"
                                        >
                                            <option value="">-- Seleccionar --</option>
                                            {printers.map(p => (
                                                <option key={p.id} value={p.id}>{p.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>

          </div>
        )}

        {activeTab === 'general' && (
           <div className="flex flex-col items-center justify-center h-full text-slate-500">
              <AlertCircle size={48} className="mb-4 opacity-50" />
              <p>Configuración general en construcción.</p>
           </div>
        )}

        {/* HIDDEN TEST TICKET FOR NATIVE PRINTING */}
        <div id="printable-test-ticket" style={{ display: 'none' }}>
           <div style={{ textAlign: 'center', marginBottom: '20px' }}>
               <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>REFUGIO POS</h2>
               <p style={{ margin: 0, fontSize: '14px' }}>Ticket de Prueba</p>
               <p style={{ margin: '10px 0', borderBottom: '1px dashed black' }}></p>
           </div>
           <div style={{ fontSize: '12px', lineHeight: '1.6' }}>
               <p><strong>Impresora:</strong> {printerForTest?.name || 'Desconocida'}</p>
               <p><strong>Modelo:</strong> {printerForTest?.model || 'Desconocido'}</p>
               <p><strong>IP Configurada:</strong> {printerForTest?.ip || '---'}</p>
               <p><strong>Fecha:</strong> {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
           </div>
           <div style={{ marginTop: '20px', borderTop: '1px dashed black', paddingTop: '10px', textAlign: 'center' }}>
               <p style={{ fontSize: '14px', fontWeight: 'bold' }}>CONEXIÓN OK</p>
               <p style={{ fontSize: '10px' }}>Si puede leer esto, la impresión nativa funciona correctamente.</p>
           </div>
        </div>

      </div>
    </div>
  );
};