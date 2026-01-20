
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'inventory', label: 'Estoque Central', icon: 'fa-boxes-stacked' },
    { id: 'sales', label: 'Faturamento (Venda)', icon: 'fa-cart-shopping' },
    { id: 'stock-in', label: 'Suprimentos (Entrada)', icon: 'fa-truck-ramp-box' },
    { id: 'reports', label: 'Relatórios', icon: 'fa-file-invoice-dollar' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col h-screen sticky top-0">
      <div className="p-6">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <i className="fas fa-store text-blue-400"></i>
          Gestão<span className="text-blue-400">Pro</span>
        </h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
              currentView === item.id 
                ? 'bg-blue-600 text-white font-medium' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <i className={`fas ${item.icon} w-6 text-center`}></i>
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
            <i className="fas fa-user"></i>
          </div>
          <div>
            <p className="text-sm font-medium">Administrador</p>
            <p className="text-xs text-slate-500">Loja Aberta</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
