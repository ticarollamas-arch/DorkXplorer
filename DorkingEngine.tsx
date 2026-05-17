
import React, { useState, useEffect } from 'react';
import { PRESET_DORKS } from '../constants';
import { Copy, ExternalLink, Search, Database, HardDrive, FileText, FolderOpen, Loader2, Sparkles, History, Trash2, Globe } from 'lucide-react';
import { generateBatchDorks } from '../services/geminiService';
import { BatchDorkResult, DorkItem } from '../types';

const DorkingEngine: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'presets' | 'batch'>('presets');
  const [batchResults, setBatchResults] = useState<BatchDorkResult | null>(null);
  const [history, setHistory] = useState<BatchDorkResult[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'categories'>('categories');
  const [userIP, setUserIP] = useState<string>('');

  // IP Fetching for identity-based local history
  useEffect(() => {
    const fetchIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIP(data.ip);
        
        // Load history after IP is known
        const savedHistory = localStorage.getItem(`dork_history_${data.ip}`);
        if (savedHistory) {
          setHistory(JSON.parse(savedHistory));
        }
      } catch (e) {
        console.error("Failed to fetch IP for history isolation", e);
      }
    };
    fetchIP();
  }, []);

  const saveToHistory = (result: BatchDorkResult) => {
    const newHistory = [result, ...history.filter(h => h.keyword !== result.keyword)].slice(0, 50);
    setHistory(newHistory);
    if (userIP) {
      localStorage.setItem(`dork_history_${userIP}`, JSON.stringify(newHistory));
    }
  };

  const clearHistory = () => {
    setHistory([]);
    if (userIP) {
      localStorage.removeItem(`dork_history_${userIP}`);
    }
    setBatchResults(null);
  };

  // Local Fast Generator (Python translation)
  const generateFastBatch = (kw: string): BatchDorkResult => {
    const termo = kw.includes(' ') ? `"${kw}"` : kw;
    return {
      keyword: kw,
      timestamp: new Date().toISOString(),
      categories: {
        "Documents_Media": [
          { type: 'file', query: `filetype:pdf OR filetype:docx OR filetype:epub ${termo}`, description: 'General documents scanner' },
          { type: 'file', query: `intitle:"${kw}" filetype:pdf`, description: 'Title-matched PDFs' },
          { type: 'file', query: `inurl:documents ${termo} ext:pdf`, description: 'Document directory probes' }
        ],
        "Leaked_Files_Logs": [
          { type: 'shodan', query: `filetype:log OR filetype:sql OR filetype:env ${termo}`, description: 'System critical files' },
          { type: 'shodan', query: `${termo} "password" OR "credentials" filetype:log`, description: 'Credential leak analyzer' },
          { type: 'shodan', query: `ext:bkp OR ext:bak OR ext:old ${termo}`, description: 'Backup file hunter' }
        ],
        "Exposed_Directories": [
          { type: 'google', query: `intitle:"index of" "${kw}"`, description: 'Basic directory listing' },
          { type: 'google', query: `intitle:"index of /" ${termo} (uploads|files|backups)`, description: 'High-value directory index' },
          { type: 'google', query: `inurl:/wp-content/uploads/ ${termo}`, description: 'WP Uploads exposure' }
        ],
        "Cloud_Storage": [
          { type: 'cloud', query: `site:drive.google.com/drive/folders/ ${termo}`, description: 'Google Drive folders' },
          { type: 'cloud', query: `site:s3.amazonaws.com OR site:storage.googleapis.com ${termo}`, description: 'AWS S3 / GCP Storage' },
          { type: 'cloud', query: `site:onedrive.live.com ${termo}`, description: 'OneDrive public links' }
        ]
      }
    };
  };

  const handleBatchGenerate = async (useAI: boolean = false) => {
    if (!keyword.trim()) return;
    setLoading(true);
    setActiveTab('batch');
    
    try {
      if (useAI) {
        const aiData = await generateBatchDorks(keyword);
        const result: BatchDorkResult = {
          keyword,
          timestamp: new Date().toISOString(),
          categories: aiData.categories
        };
        setBatchResults(result);
        saveToHistory(result);
      } else {
        const result = generateFastBatch(keyword);
        setBatchResults(result);
        saveToHistory(result);
      }
    } catch (error) {
      console.error("Batch generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getIconForCategory = (cat: string) => {
    switch (cat.toLowerCase()) {
      case 'cloud_storage': return <Database className="text-blue-400" />;
      case 'exposed_directories': return <FolderOpen className="text-orange-400" />;
      case 'documents_media': return <FileText className="text-green-400" />;
      case 'leaked_files_logs': return <HardDrive className="text-red-400" />;
      default: return <Globe className="text-cyan-400" />;
    }
  };

  const renderDorkCard = (dork: DorkItem, idx: number) => (
    <div key={idx} className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 group hover:border-cyan-500/30 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
              dork.type === 'google' ? 'bg-blue-500/20 text-blue-400' : 
              dork.type === 'shodan' ? 'bg-orange-500/20 text-orange-400' :
              dork.type === 'file' ? 'bg-green-500/20 text-green-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {dork.type}
            </span>
            <p className="text-[11px] font-medium text-slate-400 line-clamp-1">{dork.description}</p>
          </div>
          <div className="flex space-x-1">
            <button 
              onClick={() => copyToClipboard(dork.query)}
              className="p-1.5 text-slate-500 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
              title="Copy Query"
            >
              <Copy size={14} />
            </button>
            <a
              href={dork.type === 'shodan' ? `https://www.shodan.io/search?query=${encodeURIComponent(dork.query)}` : `https://www.google.com/search?q=${encodeURIComponent(dork.query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-500 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
            >
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
        <div className="bg-black/60 p-3 rounded-lg border border-slate-800/50 group-hover:border-slate-700 transition-all mb-2">
          <code className="text-cyan-400 text-[11px] break-all mono font-light">
            {dork.query}
          </code>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-2 sm:gap-3 text-balance">
            <Search className="text-cyan-400 sm:w-8 sm:h-8 w-6 h-6" />
            MOTOR DE <span className="text-cyan-400">DORKING</span> EM LOTE
          </h2>
          <p className="text-slate-500 font-medium">Cyber-intelligence dork generator & automation suite.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Keyword (ex: AlvoEspecifico)..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-slate-200 outline-none focus:border-cyan-500/50 transition-all font-mono text-sm"
              onKeyDown={(e) => e.key === 'Enter' && handleBatchGenerate()}
            />
          </div>
          <button 
            onClick={() => handleBatchGenerate(false)}
            disabled={loading || !keyword}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
          >
            {loading && !activeTab ? <Loader2 className="animate-spin" size={18} /> : <Database size={18} />}
            <span>Lote Local</span>
          </button>
          <button 
            onClick={() => handleBatchGenerate(true)}
            disabled={loading || !keyword}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/10"
          >
            {loading && activeTab === 'batch' ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            <span>Gerar com IA</span>
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-1 p-1 bg-slate-900 w-fit rounded-xl border border-slate-800">
        <button 
          onClick={() => setActiveTab('presets')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'presets' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Globe size={16} /> Presets
        </button>
        <button 
          onClick={() => setActiveTab('batch')}
          className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'batch' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'}`}
        >
          <Database size={16} /> Batch Matrix
        </button>
      </div>

      {activeTab === 'presets' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PRESET_DORKS.map((dork, idx) => {
            const dynamicDork = {
              ...dork,
              query: keyword 
                ? dork.query
                    .replace(/example\.com/g, keyword.includes('.') ? keyword : `${keyword}.com`)
                    .replace(/target\.com/g, keyword.includes('.') ? keyword : `${keyword}.com`)
                    .replace(/corp\.com/g, keyword.includes('.') ? keyword : `${keyword}.com`)
                    .replace(/TargetName/g, keyword)
                : dork.query
            };
            return renderDorkCard(dynamicDork as DorkItem, idx);
          })}
        </div>
      )}

      {activeTab === 'batch' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-8">
            {batchResults ? (
              <div className="space-y-10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                      <Sparkles size={18} className="sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold text-white capitalize truncate max-w-[200px] sm:max-w-none">{batchResults.keyword}</h3>
                      <p className="text-[10px] sm:text-xs text-slate-500 font-mono">{new Date(batchResults.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800 self-end sm:self-auto">
                      <button 
                        onClick={() => setViewMode('categories')} 
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'categories' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}
                      >
                        Categories
                      </button>
                      <button 
                        onClick={() => setViewMode('grid')} 
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}
                      >
                        Compact
                      </button>
                    </div>
                    <button 
                      onClick={() => setBatchResults(null)}
                      className="p-2 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-2 text-xs font-bold"
                      title="Clear results"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">Limpar Tudo</span>
                    </button>
                  </div>
                </div>

                {viewMode === 'categories' ? (
                  <div className="space-y-12">
                    {Object.entries(batchResults.categories).map(([cat, dorks]) => (
                      <div key={cat} className="space-y-4">
                        <div className="flex items-center gap-3 border-l-4 border-cyan-500 pl-4">
                          {getIconForCategory(cat)}
                          <h4 className="text-lg font-black text-white uppercase tracking-wider">
                            {cat.replace(/_/g, ' ')}
                          </h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(dorks as DorkItem[]).map((d, i) => renderDorkCard(d, i))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(Object.values(batchResults.categories).flat() as DorkItem[]).map((d, i) => renderDorkCard(d, i))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-slate-800 rounded-3xl text-slate-500 space-y-4">
                <Database size={48} className="opacity-20" />
                <p className="font-bold">No batch generated yet.</p>
                <p className="text-sm max-w-xs text-center opacity-70">Enter a keyword above to generate a full matrix of search parameters.</p>
              </div>
            )}
          </div>

          <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-6 h-fit sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                <History size={16} className="text-cyan-400" /> Vitrine de Histórico
              </h3>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-slate-500 hover:text-red-400 transition-colors">
                  <Trash2 size={16} />
                </button>
              )}
            </div>
            
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {history.length === 0 ? (
                <div className="text-center py-10 text-xs text-slate-600">
                  Histórico vazio
                </div>
              ) : (
                history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setKeyword(h.keyword);
                      setBatchResults(h);
                      setActiveTab('batch');
                    }}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      batchResults?.keyword === h.keyword 
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-[12px] truncate">{h.keyword}</span>
                      <Sparkles size={10} className="opacity-30" />
                    </div>
                    <div className="text-[10px] opacity-50 font-mono">
                      {new Date(h.timestamp).toLocaleDateString()} {new Date(h.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DorkingEngine;
