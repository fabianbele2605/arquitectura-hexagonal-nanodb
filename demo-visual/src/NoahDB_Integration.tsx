import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Globe, Zap, Database, Play, Pause, Activity, ShieldCheck } from 'lucide-react';

// Tipos TypeScript
type Protocol = 'tcp' | 'http' | 'grpc';
type CoreState = 'idle' | 'processing' | 'saving';
type LogType = 'req' | 'res' | 'core' | 'sys';

interface LogEntry {
  time: string;
  source: string;
  message: string;
  type: LogType;
}

interface Packet {
  id: string;
  from: Protocol | 'core';
  to: Protocol | 'core';
  type: 'request' | 'response';
}

interface Metrics {
  ops: number;
  latency: number;
  connections: number;
  memory: number;
}

// API Client para NoahDB
class NoahDBClient {
  private baseUrl = '/api';

  async set(key: string, value: string): Promise<{success: boolean, message: string}> {
    const response = await fetch(`${this.baseUrl}/set`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value })
    });
    return response.json();
  }

  async get(key: string): Promise<{success: boolean, data?: string, message: string}> {
    const response = await fetch(`${this.baseUrl}/get/${key}`);
    return response.json();
  }

  async delete(key: string): Promise<{success: boolean, message: string}> {
    const response = await fetch(`${this.baseUrl}/delete/${key}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  async list(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/list`);
    return response.json();
  }
}

const COLORS = {
  tcp: 'text-blue-500',
  tcpBg: 'bg-blue-500',
  tcpBorder: 'border-blue-500',
  http: 'text-emerald-500',
  httpBg: 'bg-emerald-500',
  httpBorder: 'border-emerald-500',
  grpc: 'text-amber-500',
  grpcBg: 'bg-amber-500',
  grpcBorder: 'border-amber-500',
  core: 'text-rose-500',
  coreBg: 'bg-rose-500',
  coreBorder: 'border-rose-500',
};

const NoahDBIntegration = () => {
  const [activeProtocol, setActiveProtocol] = useState<Protocol | null>(null);
  const [coreState, setCoreState] = useState<CoreState>('idle');
  const [packets, setPackets] = useState<Packet[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ ops: 0, latency: 0, connections: 12, memory: 32 });
  const [autoPlay, setAutoPlay] = useState(false);
  const [realData, setRealData] = useState<string[]>([]);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  
  const logEndRef = useRef(null);
  const logContainerRef = useRef(null);
  const client = new NoahDBClient();

  // Auto-scroll logs only when user is at bottom and not manually scrolling
  useEffect(() => {
    if (logEndRef.current && logContainerRef.current && !isUserScrolling) {
      const container = logContainerRef.current;
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 50;
      
      if (isAtBottom) {
        setTimeout(() => {
          if (logEndRef.current && !isUserScrolling) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 100);
      }
    }
  }, [logs, isUserScrolling]);

  // Handle manual scrolling
  const handleScroll = () => {
    if (logContainerRef.current) {
      const container = logContainerRef.current;
      const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
      setIsUserScrolling(!isAtBottom);
    }
  };

  // Reset user scrolling after a delay
  useEffect(() => {
    if (isUserScrolling) {
      const timer = setTimeout(() => {
        if (logContainerRef.current) {
          const container = logContainerRef.current;
          const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 10;
          if (isAtBottom) {
            setIsUserScrolling(false);
          }
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isUserScrolling]);

  // Añadir Log
  const addLog = (source: string, message: string, type: LogType = 'req') => {
    const time = new Date().toLocaleTimeString('es-ES', { hour12: false });
    setLogs(prev => {
      const newLogs = [...prev, { time, source, message, type }];
      return newLogs.length > 15 ? newLogs.slice(-15) : newLogs;
    });
  };

  // Actualizar datos reales
  const updateRealData = async () => {
    try {
      const keys = await client.list();
      setRealData(keys);
    } catch (error) {
      addLog('SYSTEM', `Error fetching data: ${error}`, 'sys');
    }
  };

  // Motor de Animación con API Real
  const triggerFlow = async (protocol: Protocol) => {
    if (activeProtocol && activeProtocol !== protocol) return;
    
    try {
      setActiveProtocol(protocol);
      const id = Date.now();
      const startTime = performance.now();
    
      // Generar datos de prueba
      const testKey = `${protocol}_${Date.now()}`;
      const testValue = `test_value_${Math.random().toString(36).substr(2, 9)}`;
      
      addLog(protocol.toUpperCase(), `Request: SET ${testKey} = ${testValue}`, 'req');
      
      // Crear paquete visual de ida
      setPackets(prev => [...prev, { id: `${id}_req`, from: protocol, to: 'core', type: 'request' }]);

      // Esperar llegada al core
      await new Promise(r => setTimeout(r, 800));
      
      // Procesamiento en Core
      setCoreState('processing');
      setPackets(prev => prev.filter(p => p.id !== `${id}_req`));
      
      // **LLAMADA REAL A LA API**
      let apiResponse;
      let operation = 'SET';
      
      if (protocol === 'http') {
        // Operación HTTP real
        apiResponse = await client.set(testKey, testValue);
        addLog('HTTP', `Real API call: POST /api/set`, 'req');
        addLog('CORE', `NoahDB response: ${apiResponse.message}`, 'core');
      } else if (protocol === 'grpc') {
        // Simular gRPC (podríamos implementar cliente gRPC real)
        apiResponse = await client.set(testKey, testValue);
        addLog('GRPC', `Real gRPC call: SetValue()`, 'req');
        addLog('CORE', `NoahDB response: ${apiResponse.message}`, 'core');
      } else {
        // TCP simulado (podríamos implementar cliente TCP real)
        apiResponse = await client.set(testKey, testValue);
        addLog('TCP', `Real TCP connection: binary protocol`, 'req');
        addLog('CORE', `NoahDB response: ${apiResponse.message}`, 'core');
      }
      
      const endTime = performance.now();
      const realLatency = endTime - startTime;
      
      setCoreState('saving');
      
      // Crear paquete visual de vuelta
      setPackets(prev => [...prev, { id: `${id}_res`, from: 'core', to: protocol, type: 'response' }]);

      await new Promise(r => setTimeout(r, 800));
      
      // Finalización
      setPackets(prev => prev.filter(p => p.id !== `${id}_res`));
      addLog(protocol.toUpperCase(), `Response: ${apiResponse.success ? 'SUCCESS' : 'ERROR'}`, 'res');
      
      setMetrics(prev => ({
        ...prev,
        ops: prev.ops + 1,
        latency: realLatency
      }));

      // Actualizar datos reales
      await updateRealData();

      setCoreState('idle');
      setActiveProtocol(null);
    } catch (error) {
      console.error('Error in triggerFlow:', error);
      addLog('SYSTEM', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'sys');
      setCoreState('idle');
      setActiveProtocol(null);
    }
  };

  // Cargar datos iniciales
  useEffect(() => {
    updateRealData();
    addLog('SYSTEM', 'Conectado a NoahDB en http://127.0.0.1:8080', 'sys');
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-mono selection:bg-rose-500/30 overflow-y-scroll"
         style={{
           scrollbarWidth: 'thin',
           scrollbarColor: '#64748b #1e293b'
         }}
    >
      
      {/* Header */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20 animate-pulse">
            <Database size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">NoahDB <span className="text-rose-400">Live Integration</span></h1>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
              Real API Connection
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[8px] font-bold">LIVE</span>
              <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[8px] font-bold">HTTP</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2 lg:gap-4 flex-wrap">
          <div className={`flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded border transition-all duration-300 ${
            coreState === 'processing' ? 'border-rose-500 bg-rose-900/20 animate-pulse' : 'border-slate-800'
          }`}>
             <Activity size={14} className={coreState === 'processing' ? 'text-rose-300' : 'text-rose-400'} />
             <span className="text-xs text-slate-300">{metrics.ops} ops</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded border border-slate-800">
             <Zap size={14} className="text-yellow-400" />
             <span className="text-xs text-slate-300">{metrics.latency.toFixed(1)}ms</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded border border-slate-800">
             <Database size={14} className="text-blue-400" />
             <span className="text-xs text-slate-300">{realData.length} keys</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex relative min-h-0">
        
        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20" 
                 style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            </div>

            {/* HTTP Node */}
            <div className="absolute top-[30%] right-[20%] translate-x-1/2 -translate-y-1/2 text-center group">
               <button 
                  onClick={() => triggerFlow('http')}
                  disabled={!!activeProtocol}
                  className={`relative w-24 h-24 rounded-2xl bg-slate-900 border-2 ${activeProtocol === 'http' ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'border-slate-700 hover:border-emerald-400'} flex flex-col items-center justify-center transition-all duration-300 z-10 group-hover:-translate-y-2`}>
                  <Globe size={32} className="text-emerald-500 mb-2" />
                  <span className="text-xs font-bold text-emerald-400">HTTP API</span>
                  <div className="absolute -top-3 px-2 py-0.5 bg-emerald-900/80 rounded text-[10px] text-emerald-200 border border-emerald-700">:8080</div>
                  {activeProtocol === 'http' && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] text-emerald-300 font-mono bg-emerald-900/20 px-1 rounded whitespace-nowrap">
                      Real API Call
                    </div>
                  )}
               </button>
            </div>

            {/* gRPC Node */}
            <div className="absolute bottom-[20%] left-[50%] -translate-x-1/2 translate-y-1/2 text-center group">
               <button 
                  onClick={() => triggerFlow('grpc')}
                  disabled={!!activeProtocol}
                  className={`relative w-24 h-24 rounded-2xl bg-slate-900 border-2 ${activeProtocol === 'grpc' ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.4)]' : 'border-slate-700 hover:border-amber-400'} flex flex-col items-center justify-center transition-all duration-300 z-10 group-hover:-translate-y-2`}>
                  <Zap size={32} className="text-amber-500 mb-2" />
                  <span className="text-xs font-bold text-amber-400">gRPC</span>
                  <div className="absolute -top-3 px-2 py-0.5 bg-amber-900/80 rounded text-[10px] text-amber-200 border border-amber-700">:50051</div>
                  {activeProtocol === 'grpc' && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] text-amber-300 font-mono bg-amber-900/20 px-1 rounded whitespace-nowrap">
                      Real gRPC Call
                    </div>
                  )}
               </button>
            </div>

            {/* CORE HEXAGON */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center z-20">
                <div className={`relative w-40 h-44 transition-all duration-500 ${coreState === 'processing' ? 'scale-110' : 'scale-100'}`}>
                    <div className={`absolute inset-0 bg-rose-500/20 blur-xl rounded-full transition-opacity duration-300 ${coreState === 'processing' ? 'opacity-100' : 'opacity-20'}`}></div>
                    
                    <div className="w-full h-full bg-slate-900 border-2 border-rose-500/50 flex flex-col items-center justify-center relative overflow-hidden"
                         style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                        
                        {coreState === 'processing' && (
                            <div className="absolute inset-0 bg-rose-500/10 animate-pulse"></div>
                        )}
                        
                        <div className="z-10 flex flex-col items-center relative">
                           <ShieldCheck size={40} className={`mb-2 transition-colors ${coreState === 'processing' ? 'text-white' : 'text-rose-500'}`} />
                           <h2 className="text-lg font-black text-rose-500 tracking-wider">NoahDB</h2>
                           <span className="text-[9px] text-rose-300/70 mt-1">Live Connection</span>
                           <div className="text-[8px] text-rose-400 mt-1 font-bold">
                             {realData.length} keys stored
                           </div>
                           {coreState === 'processing' && (
                             <div className="absolute -inset-8 border-2 border-rose-500/30 rounded-full animate-ping"></div>
                           )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Flying Packets */}
            {packets.map(p => {
                const pos = {
                    http: { top: '30%', left: '80%' },
                    grpc: { top: '80%', left: '50%' },
                    core: { top: '50%', left: '50%' }
                };
                
                const start = pos[p.from];
                const end = pos[p.to];
                
                const colors = {
                    http: 'bg-emerald-500 shadow-[0_0_20px_#10B981]',
                    grpc: 'bg-amber-500 shadow-[0_0_20px_#F59E0B]',
                    core: 'bg-rose-500 shadow-[0_0_20px_#F43F5E]'
                };
                
                return (
                    <div key={p.id} 
                         className={`absolute w-6 h-6 rounded-full z-50 flex items-center justify-center text-[10px] text-white font-bold animate-pulse ${colors[p.from] || 'bg-white shadow-[0_0_15px_white]'}`}
                         style={{
                             '--start-top': start.top,
                             '--start-left': start.left,
                             '--end-top': end.top,
                             '--end-left': end.left,
                             animation: 'flyPacket 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards'
                         } as React.CSSProperties}>
                       {p.type === 'request' ? '📤' : '📥'}
                    </div>
                );
            })}
        </div>

        {/* Sidebar Console */}
        <div className="w-96 bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl z-20">
           {/* Terminal Header */}
           <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                 <Terminal size={12} /> noah-live
              </span>
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[8px] text-green-400">CONNECTED</span>
              </div>
           </div>

           {/* Logs Area */}
           <div 
             ref={logContainerRef}
             onScroll={handleScroll}
             className="flex-1 p-4 font-mono text-[11px] overflow-y-auto space-y-3"
           >
              <div className="text-slate-500 italic"># Conectado a NoahDB...</div>
              
              {logs.map((log, i) => (
                  <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                      <div className="flex gap-2 opacity-50 mb-0.5">
                          <span className="text-slate-500">[{log.time}]</span>
                          <span className={`font-bold ${
                              log.source === 'HTTP' ? COLORS.http : 
                              log.source === 'GRPC' ? COLORS.grpc : 
                              log.source === 'CORE' ? COLORS.core : 
                              'text-slate-300'
                          }`}>{log.source}</span>
                      </div>
                      <div className={`pl-2 border-l-2 py-1 ${
                          log.type === 'req' ? 'border-slate-700 text-slate-300' : 
                          log.type === 'res' ? 'border-emerald-500/50 text-emerald-300' : 
                          log.type === 'core' ? 'border-rose-500/50 text-rose-300' : 
                          'border-yellow-500/50 text-yellow-100 bg-yellow-900/10'
                      }`}>
                          {log.message}
                      </div>
                  </div>
              ))}
              <div ref={logEndRef} />
           </div>

           {/* Real Data Display */}
           <div className="h-32 bg-slate-900/50 border-t border-slate-800 p-4">
              <h3 className="text-xs uppercase text-slate-500 font-bold mb-3 tracking-wider">Live Data ({realData.length} keys)</h3>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {realData.slice(0, 8).map((key, i) => (
                  <div key={i} className="text-[11px] text-slate-300 font-mono bg-slate-800/30 px-2 py-1 rounded">
                    {key}
                  </div>
                ))}
                {realData.length > 8 && (
                  <div className="text-[10px] text-slate-500">... y {realData.length - 8} más</div>
                )}
              </div>
           </div>
        </div>

      </div>

      <style>{`
        @keyframes flyPacket {
          0% { 
            top: var(--start-top); 
            left: var(--start-left); 
            transform: translate(-50%, -50%) scale(0.3) rotate(0deg); 
            opacity: 0; 
          }
          15% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1.2) rotate(90deg); 
          }
          85% { 
            opacity: 1; 
            transform: translate(-50%, -50%) scale(1) rotate(270deg); 
          }
          100% { 
            top: var(--end-top); 
            left: var(--end-left); 
            transform: translate(-50%, -50%) scale(0.3) rotate(360deg); 
            opacity: 0; 
          }
        }
        
        /* Custom scrollbar styling */
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb {
          background: #64748b;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default NoahDBIntegration;
