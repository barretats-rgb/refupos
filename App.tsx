import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TableMap } from './components/TableMap';
import { OrderView } from './components/OrderView';
import { SettingsView } from './components/SettingsView';
import { INITIAL_TABLES, INITIAL_MAP_ELEMENTS } from './constants';
import { Table, MapElement, Printer, PrinterRoute, Category } from './types';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'map' | 'kitchen' | 'settings'>('map');
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [mapElements, setMapElements] = useState<MapElement[]>(INITIAL_MAP_ELEMENTS);
  const [activeTableId, setActiveTableId] = useState<number | null>(null);

  // --- Printer State Lifted ---
  const [printers, setPrinters] = useState<Printer[]>([
    { id: 'p1', name: 'Caja Principal', ip: '192.168.100.10', model: 'Epson TM-T20III', status: 'offline', isDefault: true },
  ]);
  
  const [printerRoutes, setPrinterRoutes] = useState<PrinterRoute[]>(() => {
    // Initial: All to p1
    return Object.values(Category).map(cat => ({
      categoryId: cat,
      printerId: 'p1'
    }));
  });

  // Handle selecting a table
  const handleSelectTable = (tableId: number) => {
    setActiveTableId(tableId);
  };

  // Handle updating table state
  const handleUpdateTable = (updatedTable: Table) => {
    setTables(prev => prev.map(t => t.id === updatedTable.id ? updatedTable : t));
  };

  const handleAddTable = (newTable: Table) => {
    setTables(prev => [...prev, newTable]);
  };

  const handleDeleteTable = (tableId: number) => {
    setTables(prev => prev.filter(t => t.id !== tableId));
  };

  const handleUpdateMapElement = (updatedElement: MapElement) => {
    setMapElements(prev => prev.map(e => e.id === updatedElement.id ? updatedElement : e));
  };

  // Close the order view
  const handleCloseOrderView = () => {
    setActiveTableId(null);
  };

  const activeTable = tables.find(t => t.id === activeTableId);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden selection:bg-amber-500/30">
      
      {/* Sidebar Navigation */}
      <Sidebar activeView={activeView} onChangeView={setActiveView} />

      {/* Main Content Area */}
      <main className="flex-1 relative">
        
        {/* Layer 1: Table Map (Always rendered) */}
        <div className={`absolute inset-0 transition-opacity duration-300 ${activeTableId ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
           {activeView === 'map' && (
             <TableMap 
                tables={tables} 
                mapElements={mapElements}
                onSelectTable={handleSelectTable} 
                onUpdateTable={handleUpdateTable}
                onAddTable={handleAddTable}
                onDeleteTable={handleDeleteTable}
                onUpdateMapElement={handleUpdateMapElement}
             />
           )}
           {activeView === 'kitchen' && (
             <div className="flex items-center justify-center h-full text-slate-500 flex-col gap-4">
               <div className="w-16 h-16 border-2 border-slate-700 border-dashed rounded-full animate-spin-slow"></div>
               <p>Vista de Cocina en construcción...</p>
             </div>
           )}
           {activeView === 'settings' && (
             <SettingsView 
                printers={printers}
                onUpdatePrinters={setPrinters}
                routes={printerRoutes}
                onUpdateRoutes={setPrinterRoutes}
             />
           )}
        </div>

        {/* Layer 2: Order View (Overlay) */}
        {activeTableId !== null && activeTable && (
          <div className="absolute inset-0 z-20 bg-slate-950">
            <OrderView 
              table={activeTable} 
              onUpdateTable={handleUpdateTable}
              onClose={handleCloseOrderView}
              printers={printers}
              routes={printerRoutes}
            />
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
