
import React from 'react';
import { Search, BrainCircuit, ShieldAlert, Zap, Lock, Globe, Terminal, Database } from 'lucide-react';

interface IntroductionProps {
  onStart: () => void;
}

const Introduction: React.FC<IntroductionProps> = ({ onStart }) => {
  const [acceptedTerms, setAcceptedTerms] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);

  const handleStart = () => {
    if (acceptedTerms) {
      onStart();
    } else {
      setShowTerms(true);
    }
  };

  return (
    <div className="space-y-16 animate-in fade-in duration-700">
      {/* Terms Modal */}
      {showTerms && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400">
              <ShieldAlert size={24} />
              <h2 className="text-xl font-bold uppercase tracking-tight">Termos de Uso e Privacidade</h2>
            </div>
            <div className="text-slate-400 text-sm space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar leading-relaxed">
              <p>Ao utilizar esta ferramenta, você concorda que:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>O uso desta ferramenta é para fins estritamente educacionais e de auditoria autorizada.</li>
                <li>O histórico de buscas é vinculado temporariamente ao seu endereço IP para garantir sua privacidade entre sessões.</li>
                <li>Não armazenamos dados sensíveis permanentemente em nossos servidores centrais fora da sua sessão atual.</li>
                <li>Você assume total responsabilidade por qualquer ação realizada utilizando as strings de busca geradas.</li>
              </ul>
              <p className="text-xs italic">Se você discordar dos termos, o acesso às funcionalidades avançadas de armazenamento e análise será restrito.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button 
                onClick={() => {
                  setAcceptedTerms(true);
                  setShowTerms(false);
                  onStart();
                }}
                className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all"
              >
                Aceito os Termos
              </button>
              <button 
                onClick={() => {
                  setShowTerms(false);
                  // Optional: Redirect or just stay on intro
                }}
                className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl font-bold transition-all"
              >
                Discordo
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-full text-xs font-bold uppercase tracking-[0.2em] mb-4">
          <ShieldAlert size={14} />
          <span>Professional Reconnaissance Suite</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white leading-tight">
          INTELIGÊNCIA DE <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
            DORKING AVANÇADO
          </span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg md:text-xl font-medium leading-relaxed">
          Uma suíte de ferramentas de nível empresarial para auditores e pesquisadores de segurança. 
          Vara a infraestrutura, descubra vazamentos e analise estratégias de telemetria com precisão cirúrgica.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={handleStart}
            className="px-10 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-cyan-600/20 active:scale-95"
          >
            INICIAR OPERAÇÃO
          </button>
          <a 
            href="#features" 
            className="px-10 py-4 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-2xl font-bold text-lg transition-all"
          >
            VER RECURSOS
          </a>
        </div>
      </section>

      {/* Feature Grid */}
      <section id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4 hover:border-cyan-500/30 transition-all group">
          <div className="w-14 h-14 bg-cyan-500/10 rounded-2xl flex items-center justify-center text-cyan-400 border border-cyan-500/20 group-hover:scale-110 transition-transform">
            <Search size={28} />
          </div>
          <h3 className="text-2xl font-bold text-white">Batch Dorking</h3>
          <p className="text-slate-400">
            Gere matrizes completas de busca avançada para qualquer alvo. Cobre drives, logs, diretórios e configurações críticas em segundos.
          </p>
        </div>

        <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4 hover:border-purple-500/30 transition-all group">
          <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-400 border border-purple-500/20 group-hover:scale-110 transition-transform">
            <BrainCircuit size={28} />
          </div>
          <h3 className="text-2xl font-bold text-white">AI Strategy</h3>
          <p className="text-slate-400">
            Utilize o Gemini 3.1 Pro para analisar superfícies de ataque específicas e sugerir vetores de reconhecimento personalizados por domínio.
          </p>
        </div>

        <div className="p-8 bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4 hover:border-amber-500/30 transition-all group">
          <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-500/20 group-hover:scale-110 transition-transform">
            <Lock size={28} />
          </div>
          <h3 className="text-2xl font-bold text-white">Secure Auditing</h3>
          <p className="text-slate-400">
            Ferramentas desenhadas para transparência e conformidade em processos de Red Team e auditorias de infraestrutura complexa.
          </p>
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="bg-slate-900/30 border border-slate-800 rounded-[3rem] p-12 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="space-y-4 md:max-w-md">
            <h2 className="text-4xl font-bold text-white tracking-tight">Potência Industrial para <span className="text-cyan-400">Pequenas Telas</span>.</h2>
            <p className="text-slate-400">
              Desenvolvido com foco em responsividade total e interface de alta densidade de informação. Acesse seu painel de recon de qualquer lugar.
            </p>
            <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                <Database size={12} />
                <span>4 Matrizes</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                <Terminal size={12} />
                <span>AI Native</span>
              </div>
              <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 bg-slate-950 px-3 py-1 rounded-full border border-slate-800">
                <Globe size={12} />
                <span>Stealth Mode</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-slate-950/50 rounded-3xl border border-white/5 text-center">
              <div className="text-3xl font-black text-cyan-400">∞</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Dorks/Batch</div>
            </div>
            <div className="p-6 bg-slate-950/50 rounded-3xl border border-white/5 text-center">
              <div className="text-3xl font-black text-purple-400">3.1</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">AI Engine</div>
            </div>
            <div className="p-6 bg-slate-950/50 rounded-3xl border border-white/5 text-center">
              <div className="text-3xl font-black text-amber-400">100%</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Responsive</div>
            </div>
            <div className="p-6 bg-slate-950/50 rounded-3xl border border-white/5 text-center">
              <div className="text-3xl font-black text-emerald-400">ON</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Stealth Ops</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Introduction;
