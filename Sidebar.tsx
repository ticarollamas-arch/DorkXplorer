
import React from 'react';
import { View } from '../types';
import { Search, BrainCircuit, ShieldAlert, Home } from 'lucide-react';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const items = [
    { id: View.INTRODUCTION, label: 'Introdução', icon: <Home size={20} /> },
    { id: View.DORKING, label: 'Dorking Engine', icon: <Search size={20} /> },
    { id: View.ANALYSIS, label: 'AI Strategy', icon: <BrainCircuit size={20} /> },
  ];

  return (
    <div className="w-64 h-full bg-slate-950 border-r border-slate-800 flex flex-col p-6 space-y-8 relative z-50">
      <div className="flex items-center space-x-3 text-cyan-400">
        <ShieldAlert size={28} />
      </div>

      <nav className="flex-1 space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              currentView === item.id
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-800">
        <div className="text-xs text-slate-500 uppercase font-semibold mb-2">System Status</div>
        <div className="flex items-center space-x-2 text-sm text-green-400">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <span>Active & Stealthy</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
