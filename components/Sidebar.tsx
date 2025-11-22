import React from 'react';
import { LayoutGrid, Coffee, Settings, LogOut, UtensilsCrossed } from 'lucide-react';

interface SidebarProps {
  activeView: 'map' | 'kitchen' | 'settings';
  onChangeView: (view: 'map' | 'kitchen' | 'settings') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onChangeView }) => {
  const getButtonClass = (view: string) => `
    p-4 mb-4 rounded-xl transition-all duration-200 flex flex-col items-center justify-center w-full
    ${activeView === view 
      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}
  `;

  return (
    <div className="w-24 bg-slate-900 border-r border-slate-800 flex flex-col items-center py-6 h-full">
      <div className="mb-8 text-amber-500">
        <UtensilsCrossed size={32} />
      </div>

      <nav className="flex-1 w-full px-2">
        <button 
          onClick={() => onChangeView('map')}
          className={getButtonClass('map')}
          title="Mesas"
        >
          <LayoutGrid size={24} />
          <span className="text-xs mt-1">Mesas</span>
        </button>

        <button 
          onClick={() => onChangeView('kitchen')}
          className={getButtonClass('kitchen')}
          title="Cocina"
        >
          <Coffee size={24} />
          <span className="text-xs mt-1">Cocina</span>
        </button>

        <button 
          onClick={() => onChangeView('settings')}
          className={getButtonClass('settings')}
          title="Ajustes"
        >
          <Settings size={24} />
          <span className="text-xs mt-1">Ajustes</span>
        </button>
      </nav>

      <button className="text-slate-500 hover:text-red-400 p-4">
        <LogOut size={24} />
      </button>
    </div>
  );
};