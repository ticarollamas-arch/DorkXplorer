
import React, { useState } from 'react';
import { getTelemetryStrategy } from '../services/geminiService';
import { BrainCircuit, Loader2, Sparkles, AlertCircle, Copy, Terminal } from 'lucide-react';

const AIStrategyAnalyst: React.FC = () => {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    if (!domain) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTelemetryStrategy(domain);
      setResult(data);
    } catch (err) {
      setError('Analysis failed. Verify target availability or API quota.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-xs font-bold uppercase tracking-widest">
          <Sparkles size={14} />
          <span>Gemini-Powered Intelligence</span>
        </div>
        <h2 className="text-4xl font-bold">Autonomous Strategy Analyst</h2>
        <p className="text-slate-400 max-w-xl mx-auto">
          Input a domain to discover potential telemetry endpoints and custom dorks for the specific target stack.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row max-w-md mx-auto relative gap-2 sm:gap-0">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="target-domain.com"
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-6 py-4 focus:ring-2 focus:ring-cyan-500 outline-none text-slate-200 transition-all sm:pr-32"
          onKeyDown={(e) => e.key === 'Enter' && handleAnalysis()}
        />
        <button
          onClick={handleAnalysis}
          disabled={loading || !domain}
          className="sm:absolute right-2 top-2 bottom-2 px-6 py-4 sm:py-0 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg transition-all flex items-center justify-center space-x-2 font-bold"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
          <span>{loading ? 'Analyzing' : 'Probe'}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center space-x-2 text-red-400 bg-red-400/10 border border-red-400/20 p-4 rounded-xl max-w-md mx-auto">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <Sparkles size={20} className="text-cyan-400" />
              <span>AI Suggested Dorks</span>
            </h3>
            <div className="space-y-4">
              {result.dorks.map((d: any, i: number) => (
                <div key={i} className="p-4 bg-slate-950 border border-slate-800 rounded-xl group hover:border-cyan-500/30 transition-all">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] font-bold uppercase text-cyan-400 tracking-wider bg-cyan-400/10 px-2 py-0.5 rounded">
                      {d.type}
                    </span>
                    <button onClick={() => navigator.clipboard.writeText(d.query)} className="text-slate-500 hover:text-cyan-400">
                      <Copy size={14} />
                    </button>
                  </div>
                  <code className="text-sm mono text-slate-300 block mb-2 break-all">{d.query}</code>
                  <p className="text-xs text-slate-500">{d.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                <Terminal size={20} className="text-cyan-400" />
                <span>Probable Endpoints</span>
              </h3>
              <div className="space-y-2">
                {result.endpoints.map((e: string, i: number) => (
                  <div key={i} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center space-x-3 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:scale-150 transition-all"></div>
                    <code className="text-sm mono text-slate-300">https://{domain}{e.startsWith('/') ? '' : '/'}{e}</code>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-cyan-900/10 border border-cyan-500/20 rounded-2xl p-6">
              <h4 className="text-cyan-400 font-bold mb-2 text-sm uppercase">Analysis Notes</h4>
              <p className="text-slate-400 text-sm italic leading-relaxed">
                "{result.notes}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIStrategyAnalyst;
