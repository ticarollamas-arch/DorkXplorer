
import React, { useState } from 'react';
import { View } from './types';
import Sidebar from './components/Sidebar';
import Introduction from './components/Introduction';
import DorkingEngine from './components/DorkingEngine';
import AIStrategyAnalyst from './components/AIStrategyAnalyst';
import { AlertTriangle, Github, Heart, Menu, X } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setView] = useState<View>(View.INTRODUCTION);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const renderView = () => {
    switch (currentView) {
      case View.INTRODUCTION:
        return <Introduction onStart={() => setView(View.DORKING)} />;
      case View.DORKING:
        return <DorkingEngine />;
      case View.ANALYSIS:
        return <AIStrategyAnalyst />;
      default:
        return <Introduction onStart={() => setView(View.DORKING)} />;
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden relative">
      {/* Warning Overlay for Educational Purpose */}
      <div className="fixed top-0 left-0 right-0 bg-amber-500/20 text-amber-500 px-4 py-1 text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center space-x-2 z-50 backdrop-blur-md border-b border-amber-500/20">
        <AlertTriangle size={12} />
        <span className="truncate">Educational Security Research Purposes Only. Unauthorized Access is Prohibited.</span>
        <AlertTriangle size={12} />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-6 left-0 right-0 px-6 flex justify-between items-center z-40">
        <button 
          onClick={toggleSidebar}
          className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-cyan-400"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar with Overlay on Mobile */}
      <div className={`
        fixed inset-0 z-40 lg:relative lg:z-auto transition-transform duration-300 lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <Sidebar 
          currentView={currentView} 
          setView={(view) => {
            setView(view);
            setIsSidebarOpen(false);
          }} 
        />
      </div>

      <main className="flex-1 overflow-y-auto pt-16 lg:pt-10 pb-10 px-4 md:px-12 relative flex flex-col">
        <div className="max-w-7xl mx-auto py-10">
          {renderView()}
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-10 flex flex-col sm:flex-row justify-between items-center text-slate-500 text-xs gap-4">
          <div className="flex items-center space-x-2">
            <span>Built by the Research Community</span>
            <Heart size={12} className="text-red-500 fill-red-500" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="mono">v2.1.0-beta</span>
            <a href="#" className="hover:text-cyan-400 transition-colors flex items-center space-x-1">
              <Github size={14} />
              <span>Source</span>
            </a>
          </div>
        </footer>
      </main>

      {/* Glow Effect */}
      <div className="fixed top-[-10%] right-[-10%] w-[50%] h-[50%] bg-cyan-500/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full -z-10 pointer-events-none"></div>
    </div>
  );
};

export default App;
