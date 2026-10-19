import React from 'react';
import { Database, Plus, Sparkles, Terminal, FileCode, GraduationCap, RefreshCw } from 'lucide-react';

interface NavbarProps {
  activeTab: 'records' | 'ai' | 'api' | 'code';
  setActiveTab: (tab: 'records' | 'ai' | 'api' | 'code') => void;
  onOpenCreate: () => void;
  onResetData: () => void;
  isResetting: boolean;
  totalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCreate,
  onResetData,
  isResetting,
  totalCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & System Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold tracking-tight text-white">EduCore</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  SIS v2.4
                </span>
              </div>
              <p className="text-xs text-slate-400 font-normal">
                Academic Records & Database Management Platform
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
            <button
              onClick={() => setActiveTab('records')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'records'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>Student Records</span>
              <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-slate-900/60 text-slate-300">
                {totalCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'ai'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Natural Language Query</span>
            </button>

            <button
              onClick={() => setActiveTab('api')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'api'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>API Explorer</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>FastAPI Source</span>
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-2.5">
            <button
              onClick={onResetData}
              disabled={isResetting}
              title="Reset records to default standard dataset"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
              <span>{isResetting ? 'Resetting...' : 'Reset Sample Data'}</span>
            </button>

            <button
              onClick={onOpenCreate}
              className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Student</span>
            </button>
          </div>
        </div>

        {/* Mobile Submenu */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('records')}
            className={`px-2.5 py-1 rounded-md ${activeTab === 'records' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
          >
            Records ({totalCount})
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={`px-2.5 py-1 rounded-md ${activeTab === 'ai' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
          >
            AI Query
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`px-2.5 py-1 rounded-md ${activeTab === 'api' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
          >
            API Tester
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-2.5 py-1 rounded-md ${activeTab === 'code' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}
          >
            Python Code
          </button>
        </div>
      </div>
    </header>
  );
};
