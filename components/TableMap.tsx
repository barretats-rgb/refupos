import React, { useState, useRef } from 'react';
import { Table, TableStatus, TableShape, MapElement } from '../types';
import { DollarSign, RotateCw, Plus, Trash2, BoxSelect, Circle, Square, Type, PencilRuler, Check, Move } from 'lucide-react';

interface TableMapProps {
  tables: Table[];
  mapElements: MapElement[];
  onSelectTable: (tableId: number) => void;
  onUpdateTable: (table: Table) => void;
  onAddTable: (table: Table) => void;
  onDeleteTable: (tableId: number) => void;
  onUpdateMapElement: (element: MapElement) => void;
}

export const TableMap: React.FC<TableMapProps> = ({ 
  tables, 
  mapElements,
  onSelectTable, 
  onUpdateTable, 
  onAddTable, 
  onDeleteTable,
  onUpdateMapElement 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  // selectedId can be number (Table ID) or string (MapElement ID)
  const [selectedId, setSelectedId] = useState<number | string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.AVAILABLE: return 'bg-slate-700 border-slate-600 hover:bg-slate-600 hover:border-emerald-500';
      case TableStatus.OCCUPIED: return 'bg-slate-800 border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]';
      case TableStatus.PAYING: return 'bg-slate-800 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)] animate-pulse';
      default: return 'bg-slate-800';
    }
  };

  const calculateTotal = (items: Table['items']) => {
    return items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  };

  const formatCurrency = (amount: number) => {
    return `₡${amount.toLocaleString('es-CR')}`;
  };

  // --- Unified Selection Logic ---

  const handleMouseDown = (e: React.MouseEvent, item: Table | MapElement) => {
    if (!isEditing) {
      // Only tables are interactive in non-edit mode
      if (typeof item.id === 'number') {
        onSelectTable(item.id);
      }
      return;
    }

    e.stopPropagation();
    setSelectedId(item.id);
    setIsDragging(true);

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      // Calculate mouse position relative to the container percentage
      const mouseXPercent = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      const mouseYPercent = ((e.clientY - containerRect.top) / containerRect.height) * 100;
      
      dragOffset.current = {
        x: mouseXPercent - item.x,
        y: mouseYPercent - item.y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isEditing || !isDragging || selectedId === null || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const mouseXPercent = ((e.clientX - containerRect.left) / containerRect.width) * 100;
    const mouseYPercent = ((e.clientY - containerRect.top) / containerRect.height) * 100;

    const newX = Math.max(0, Math.min(100, mouseXPercent - dragOffset.current.x));
    const newY = Math.max(0, Math.min(100, mouseYPercent - dragOffset.current.y));

    if (typeof selectedId === 'number') {
      const table = tables.find(t => t.id === selectedId);
      if (table) onUpdateTable({ ...table, x: newX, y: newY });
    } else {
      const element = mapElements.find(e => e.id === selectedId);
      if (element) onUpdateMapElement({ ...element, x: newX, y: newY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleBackgroundClick = () => {
    if (isEditing) setSelectedId(null);
  };

  // --- Modification Tools ---

  const rotateSelected = () => {
    if (selectedId === null) return;
    
    if (typeof selectedId === 'number') {
      const table = tables.find(t => t.id === selectedId);
      if (table) onUpdateTable({ ...table, rotation: (table.rotation + 45) % 360 });
    } else {
      const element = mapElements.find(e => e.id === selectedId);
      if (element) onUpdateMapElement({ ...element, rotation: (element.rotation + 45) % 360 });
    }
  };

  const resizeSelected = (delta: number) => {
    if (selectedId === null) return;

    if (typeof selectedId === 'number') {
      const table = tables.find(t => t.id === selectedId);
      if (table) {
         const newSize = Math.max(40, Math.min(300, table.width + delta));
         onUpdateTable({ ...table, width: newSize, height: table.shape === 'rectangle' ? table.height + delta * 0.7 : newSize });
      }
    } else {
      const element = mapElements.find(e => e.id === selectedId);
      if (element) {
         // Logic for MapElements might be different (percentage vs pixels), but keeping it simple for now
         // MapElements use percentage for width/height if we wanted to, but keeping them pixel based or percentage based consistent with tables is tricky.
         // Let's assume width/height in types is similar unit (relative pixels)
         const newW = Math.max(10, element.width + delta);
         // For elements, we might want to scale height too? Depends on type. 
         const newH = Math.max(10, element.height + (element.type === 'bar' ? delta * 0.2 : delta)); 
         onUpdateMapElement({ ...element, width: newW, height: newH });
      }
    }
  };

  const changeTableShape = (shape: TableShape) => {
    if (typeof selectedId !== 'number') return;
    const table = tables.find(t => t.id === selectedId);
    if (table) {
      onUpdateTable({ ...table, shape });
    }
  };

  const addNewTable = () => {
    const newId = Math.max(...tables.map(t => t.id), 0) + 1;
    const newTable: Table = {
      id: newId,
      name: `Mesa ${newId}`,
      status: TableStatus.AVAILABLE,
      items: [],
      guests: 0,
      x: 50,
      y: 50,
      width: 80,
      height: 80,
      shape: 'square',
      rotation: 0
    };
    onAddTable(newTable);
    setSelectedId(newId);
  };

  const deleteSelected = () => {
    if (selectedId === null) return;
    if (typeof selectedId === 'number') {
      onDeleteTable(selectedId);
    } else {
      // Optional: Delete map element logic if we were to add it. 
      // For now we only hide the button or disable it for essential map elements if desired, 
      // but the prompt implies moving entrance, not necessarily deleting structural walls.
      // I will allow deleting elements if they are just decorative, but maybe safeguard basics?
      // Let's implement it for completeness.
      // NOTE: Parent doesn't pass onDeleteMapElement yet, so we skip.
      // If user wants to move entrance, they don't need delete.
    }
    setSelectedId(null);
  };

  const handleNameChange = (name: string) => {
     if (selectedId === null) return;
     if (typeof selectedId === 'number') {
        const table = tables.find(t => t.id === selectedId);
        if (table) onUpdateTable({ ...table, name });
     } else {
        const element = mapElements.find(e => e.id === selectedId);
        if (element) onUpdateMapElement({ ...element, label: name });
     }
  };

  const selectedTable = typeof selectedId === 'number' ? tables.find(t => t.id === selectedId) : null;
  const selectedElement = typeof selectedId === 'string' ? mapElements.find(e => e.id === selectedId) : null;
  const selectionData = selectedTable || selectedElement;

  return (
    <div className="h-full flex flex-col bg-slate-950 relative overflow-hidden" onMouseUp={handleMouseUp}>
      {/* Header Legend & Tools */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur border border-slate-800 p-4 rounded-xl shadow-xl pointer-events-auto">
          <h1 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            Refugio <span className="text-amber-500">POS</span>
          </h1>
          {!isEditing ? (
            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Disponible</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Ocupada</div>
              <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-purple-500"></span> Pagando</div>
            </div>
          ) : (
            <div className="text-xs text-amber-400 font-mono animate-pulse">
              MODO EDICIÓN ACTIVO
            </div>
          )}
        </div>

        {/* Edit Toggle Button */}
        <div className="flex gap-2 pointer-events-auto">
           {isEditing && (
             <button 
                onClick={addNewTable}
                className="p-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl shadow-lg transition-all flex items-center gap-2"
              >
                <Plus size={20} /> <span className="hidden sm:inline">Nueva Mesa</span>
              </button>
           )}
           <button 
             onClick={() => {
               setIsEditing(!isEditing);
               setSelectedId(null);
             }}
             className={`
               p-3 rounded-xl shadow-lg transition-all flex items-center gap-2 font-medium
               ${isEditing 
                 ? 'bg-amber-500 text-white shadow-amber-500/20' 
                 : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}
             `}
           >
             {isEditing ? <Check size={20} /> : <PencilRuler size={20} />}
             <span>{isEditing ? 'Guardar Mapa' : 'Editar Mapa'}</span>
           </button>
        </div>
      </div>

      {/* Floor Plan Container */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        <div 
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onClick={handleBackgroundClick}
          className={`
            min-w-[800px] min-h-[600px] w-full h-full relative bg-[#0f172a] p-8 transition-colors duration-500
            ${isEditing ? 'cursor-crosshair bg-[#0f172a]' : 'cursor-grab active:cursor-grabbing'}
          `}
        >
          
          {/* Floor Pattern */}
          <div className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${isEditing ? 'opacity-20' : 'opacity-10'}`} 
               style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
          </div>

          {/* Map Elements Layer (Walls, Entrance, Bar) */}
          {mapElements.map((element) => {
            const isSelected = isEditing && selectedId === element.id;
            // Styles based on type
            let styleClasses = "";
            let content = null;

            if (element.type === 'bar') {
                styleClasses = "bg-slate-900 border-b-4 border-amber-900/50 rounded-lg shadow-xl flex items-center justify-center";
                content = <span className="text-slate-700 font-black tracking-[0.2em] opacity-30 uppercase text-xs md:text-base pointer-events-none select-none">{element.label}</span>;
            } else if (element.type === 'entrance') {
                styleClasses = "bg-slate-800/50 border-2 border-dashed border-slate-600 flex items-center justify-center";
                content = <span className="text-[9px] text-slate-500 uppercase tracking-widest pointer-events-none select-none">{element.label}</span>;
            } else if (element.type === 'kitchen') {
                 styleClasses = "bg-slate-800 border-l border-slate-700 flex items-center justify-center";
                 content = <span className="text-slate-600 font-mono text-[10px] -rotate-90 pointer-events-none select-none">{element.label}</span>;
            }

            return (
               <div
                  key={element.id}
                  onMouseDown={(e) => handleMouseDown(e, element)}
                  style={{ 
                    left: `${element.x}%`, 
                    top: `${element.y}%`,
                    width: `${element.width}%`, // Using percentage for these usually works better for responsive layouts, or we can convert logic
                    height: `${element.height}%`, 
                    transform: `translate(-50%, -50%) rotate(${element.rotation}deg)`,
                    cursor: isEditing ? 'move' : 'default',
                    zIndex: isSelected ? 20 : 0 
                  }}
                  className={`
                    absolute transition-all duration-200 
                    ${styleClasses}
                    ${isSelected ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-900 shadow-2xl' : ''}
                  `}
               >
                 {content}
                 {/* Edit handles hint */}
                 {isEditing && <div className="absolute inset-0 bg-amber-500/5 opacity-0 hover:opacity-100 pointer-events-none border border-amber-500/20"></div>}
               </div>
            )
          })}

          {/* Tables Layer */}
          {tables.map((table) => {
            const total = calculateTotal(table.items);
            const isRound = table.shape === 'round';
            const isSelected = isEditing && selectedId === table.id;
            
            return (
              <div
                key={table.id}
                onMouseDown={(e) => handleMouseDown(e, table)}
                style={{ 
                  left: `${table.x}%`, 
                  top: `${table.y}%`,
                  width: `${table.width}px`,
                  height: `${table.height}px`,
                  transform: `translate(-50%, -50%) rotate(${table.rotation}deg)`,
                  cursor: isEditing ? 'move' : 'pointer',
                  zIndex: isSelected ? 50 : 10
                }}
                className={`
                  absolute flex flex-col items-center justify-center transition-shadow duration-200 group select-none
                  ${isRound ? 'rounded-full' : 'rounded-xl'}
                  ${getStatusColor(table.status)}
                  ${isSelected ? 'ring-4 ring-amber-500 shadow-2xl z-50' : 'shadow-lg'}
                  border-2
                `}
              >
                {/* Chairs visualization (Pseudo) */}
                <div className={`absolute inset-[-6px] border border-dashed border-slate-700/50 -z-10 ${isRound ? 'rounded-full' : 'rounded-xl'}`}></div>

                <div className={`flex flex-col items-center justify-center w-full h-full ${table.rotation ? `rotate-[-${table.rotation}deg]` : ''}`}>
                  <span className="font-bold text-white text-sm drop-shadow-md pointer-events-none">{table.name}</span>
                  
                  {!isEditing && table.status !== TableStatus.AVAILABLE && (
                    <div className="flex flex-col items-center mt-1">
                      <span className="text-[10px] text-slate-300 bg-black/30 px-1 rounded flex items-center gap-0.5">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Hover Info Card (Only when NOT editing) */}
                {!isEditing && (
                    <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs p-2 rounded-lg shadow-xl border border-slate-700 w-32 pointer-events-none z-50">
                    <div className="font-bold mb-1 border-b border-slate-700 pb-1">{table.name}</div>
                    <div className="flex justify-between text-slate-400">
                        <span>Estado:</span>
                        <span className={table.status === 'Disponible' ? 'text-emerald-400' : 'text-amber-400'}>{table.status}</span>
                    </div>
                    {table.items.length > 0 && (
                        <>
                        <div className="flex justify-between text-slate-400 mt-1">
                            <span>Items:</span>
                            <span>{table.items.length}</span>
                        </div>
                        <div className="flex justify-between text-emerald-400 font-bold mt-1 pt-1 border-t border-slate-800">
                            <span>Total:</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                        </>
                    )}
                    </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Controls Bottom Panel */}
      {isEditing && selectionData && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 flex items-center gap-4 animate-in slide-in-from-bottom-10 z-50">
           
           {/* Name Input */}
           <div className="flex items-center gap-2 border-r border-slate-700 pr-4">
             <Type size={16} className="text-slate-500" />
             <input 
                type="text" 
                value={selectedTable ? selectedTable.name : selectedElement?.label || ''} 
                onChange={(e) => handleNameChange(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-sm w-28 text-center focus:border-amber-500 focus:outline-none"
                placeholder="Nombre"
             />
           </div>

           {/* Rotate */}
           <button onClick={rotateSelected} className="flex flex-col items-center gap-1 text-slate-400 hover:text-white transition-colors group">
             <div className="p-2 rounded-lg bg-slate-800 group-hover:bg-slate-700">
                <RotateCw size={20} />
             </div>
             <span className="text-[10px]">Rotar</span>
           </button>

           {/* Shape (Only for Tables) */}
           {selectedTable && (
            <div className="flex items-center gap-1 bg-slate-800 rounded-lg p-1">
                <button 
                  onClick={() => changeTableShape('square')} 
                  className={`p-1.5 rounded ${selectedTable.shape === 'square' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Cuadrada"
                >
                  <Square size={18} />
                </button>
                <button 
                  onClick={() => changeTableShape('round')} 
                  className={`p-1.5 rounded ${selectedTable.shape === 'round' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Redonda"
                >
                  <Circle size={18} />
                </button>
                <button 
                  onClick={() => changeTableShape('rectangle')} 
                  className={`p-1.5 rounded ${selectedTable.shape === 'rectangle' ? 'bg-amber-500 text-white' : 'text-slate-400 hover:text-white'}`}
                  title="Rectangular"
                >
                  <BoxSelect size={18} />
                </button>
            </div>
           )}

           {/* Size */}
           <div className="flex flex-col gap-1">
              <button onClick={() => resizeSelected(5)} className="bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-[10px] text-slate-300">+</button>
              <button onClick={() => resizeSelected(-5)} className="bg-slate-800 hover:bg-slate-700 px-2 py-0.5 rounded text-[10px] text-slate-300">-</button>
           </div>

            {/* Delete (Only for Tables currently) */}
            {selectedTable && (
              <div className="border-l border-slate-700 pl-4 ml-2">
                <button onClick={deleteSelected} className="flex flex-col items-center gap-1 text-red-400 hover:text-red-300 transition-colors group">
                  <div className="p-2 rounded-lg bg-red-500/10 group-hover:bg-red-500/20">
                      <Trash2 size={20} />
                  </div>
                  <span className="text-[10px]">Eliminar</span>
                </button>
              </div>
            )}
        </div>
      )}
    </div>
  );
};