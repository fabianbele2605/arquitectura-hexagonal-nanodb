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

// Estilos y Constantes
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

const NanoDBArena = () => {
  // Estado del Sistema
  const [activeProtocol, setActiveProtocol] = useState<Protocol | null>(null);
  const [coreState, setCoreState] = useState<CoreState>('idle');
  const [packets, setPackets] = useState<Packet[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ ops: 0, latency: 0, connections: 12, memory: 32 });
  const [autoPlay, setAutoPlay] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [demoSpeed, setDemoSpeed] = useState(1); // 0.5x, 1x, 2x
  const [showStats, setShowStats] = useState(false);
  const [totalPackets, setTotalPackets] = useState(0);
  const [networkParticles, setNetworkParticles] = useState<Array<{id: number, x: number, y: number, opacity: number}>>([]);

  const logEndRef = useRef(null);

  // Prevent body scroll
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Auto-scroll logs (mejorado)
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [logs]);

  // Sistema de Métricas Simulado (optimizado)
  useEffect(() => {
    if (!autoPlay && coreState === 'idle') return; // Pausa cuando no hay actividad
    
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        connections: Math.max(10, prev.connections + (Math.random() > 0.5 ? 1 : -1)),
        memory: Math.min(100, Math.max(30, prev.memory + (coreState === 'processing' ? 2 : -0.5)))
      }));
    }, autoPlay ? 500 : 2000); // Más frecuente durante autoPlay
    return () => clearInterval(interval);
  }, [coreState, autoPlay]);

  // Añadir Log (optimizado)
  const addLog = (source: string, message: string, type: LogType = 'req') => {
    const time = new Date().toLocaleTimeString('es-ES', { hour12: false });
    setLogs(prev => {
      const newLogs = [...prev, { time, source, message, type }];
      return newLogs.length > 15 ? newLogs.slice(-15) : newLogs;
    });
  };

  // Motor de Animación de Paquetes (con error handling)
  const triggerFlow = async (protocol: Protocol) => {
    if (activeProtocol && activeProtocol !== protocol) return;
    
    try {
      setActiveProtocol(protocol);
      const id = Date.now();
    
    // 1. Request: Protocolo -> Core
    let reqData = '';
    let responseData = '';
    let latency = 0;
    
    const commands = {
      tcp: [
        { req: 'SET user:1001 {"name":"Alice","role":"admin"}', res: 'OK', lat: 0.8 },
        { req: 'GET user:1001', res: '{"name":"Alice","role":"admin"}', lat: 0.6 },
        { req: 'KEYS user:*', res: '["user:1001","user:1002"]', lat: 1.1 },
        { req: 'DEL session:expired', res: '1', lat: 0.5 }
      ],
      http: [
        { req: 'POST /api/users {"name":"Bob","email":"bob@dev.com"}', res: '201 Created', lat: 1.2 },
        { req: 'GET /api/users/1002', res: '{"id":1002,"name":"Bob"}', lat: 0.9 },
        { req: 'PUT /api/users/1002 {"status":"active"}', res: '200 OK', lat: 1.0 },
        { req: 'DELETE /api/sessions/abc123', res: '204 No Content', lat: 0.7 }
      ],
      grpc: [
        { req: 'SetValue(key="config:timeout", value="30s")', res: 'Success', lat: 0.9 },
        { req: 'GetValue(key="config:timeout")', res: '"30s"', lat: 0.7 },
        { req: 'ListKeys(pattern="config:*")', res: '["config:timeout","config:retries"]', lat: 1.3 },
        { req: 'DeleteValue(key="temp:cache")', res: 'Success', lat: 0.6 }
      ]
    };
    
    const cmdSet = commands[protocol];
    const cmd = cmdSet[Math.floor(Math.random() * cmdSet.length)];
    reqData = cmd.req;
    responseData = cmd.res;
    latency = cmd.lat;

    addLog(protocol.toUpperCase(), `Request: ${reqData}`, 'req');
    
    // Crear paquete visual de ida
    setPackets(prev => [...prev, { id: `${id}_req`, from: protocol, to: 'core', type: 'request' }]);
    setTotalPackets(prev => prev + 1);

    // Esperar llegada al core
    await new Promise(r => setTimeout(r, 800));
    
    // 2. Procesamiento en Core
    setCoreState('processing');
    setPackets(prev => prev.filter(p => p.id !== `${id}_req`)); // Eliminar paquete de ida
    
    await new Promise(r => setTimeout(r, 600)); // Tiempo de proceso simulado
    
    // 3. Response: Core -> Protocolo
    setCoreState('saving'); // Efecto de guardado
    
    // Logs técnicos detallados
    if (protocol === 'tcp') {
      addLog('TCP', `Binary protocol: parsing 4-byte header`, 'req');
      addLog('CORE', `DashMap::insert() - lock-free write`, 'core');
      addLog('CORE', `Tokio runtime: spawned async task`, 'core');
    } else if (protocol === 'http') {
      addLog('HTTP', `Axum: JSON deserialization complete`, 'req');
      addLog('CORE', `DashMap::get() - concurrent read access`, 'core');
      addLog('CORE', `Memory: zero-copy string handling`, 'core');
    } else if (protocol === 'grpc') {
      addLog('GRPC', `Protobuf: message decoded successfully`, 'req');
      addLog('CORE', `DashMap::entry() - atomic operation`, 'core');
      addLog('CORE', `Async: yielding to other tasks`, 'core');
    }
    
    addLog('CORE', `Processing time: ${latency}ms`, 'core');
    
    // Crear paquete visual de vuelta
    setPackets(prev => [...prev, { id: `${id}_res`, from: 'core', to: protocol, type: 'response' }]);
    setTotalPackets(prev => prev + 1);

    await new Promise(r => setTimeout(r, 800));
    
    // 4. Finalización
    setPackets(prev => prev.filter(p => p.id !== `${id}_res`));
    addLog(protocol.toUpperCase(), `Response: ${responseData}`, 'res');
    
    setMetrics(prev => ({
      ...prev,
      ops: prev.ops + 1,
      latency: latency
    }));

      setCoreState('idle');
      setActiveProtocol(null);
    } catch (error) {
      console.error('Error in triggerFlow:', error);
      addLog('SYSTEM', `Error: ${error instanceof Error ? error.message : 'Unknown error'}`, 'sys');
      setCoreState('idle');
      setActiveProtocol(null);
    }
  };

  // Modo Auto-Pilot (Script de Demo)
  useEffect(() => {
    if (!autoPlay) return;

    const runDemo = async () => {
      try {
        const delay = (ms: number) => new Promise(r => setTimeout(r, ms / demoSpeed));
        
        addLog('SYSTEM', 'Iniciando NanoDB Protocol Arena...', 'sys');
        await delay(2000);
        
        addLog('SYSTEM', 'Servidores iniciados: TCP:6379, HTTP:8080, gRPC:50051', 'sys');
        await delay(1500);
        
        // Demo TCP
        addLog('SYSTEM', 'Demostrando protocolo TCP...', 'sys');
        await delay(1000);
        await triggerFlow('tcp');
        setTotalPackets(prev => prev + 2);
        await delay(2000);
        
        // Demo HTTP
        addLog('SYSTEM', 'Demostrando API REST HTTP...', 'sys');
        await delay(1000);
        await triggerFlow('http');
        setTotalPackets(prev => prev + 2);
        await delay(2000);
        
        // Demo gRPC
        addLog('SYSTEM', 'Demostrando servidor gRPC...', 'sys');
        await delay(1000);
        await triggerFlow('grpc');
        setTotalPackets(prev => prev + 2);
        await delay(2000);
        
        // Concurrencia
        addLog('SYSTEM', 'Simulando alta concurrencia...', 'sys');
        setCoreState('processing');
        setMetrics(prev => ({ ...prev, ops: prev.ops + 150, connections: 540, memory: 85 }));
        setTotalPackets(prev => prev + 50);
        await delay(3000);
        
        setCoreState('idle');
        addLog('SYSTEM', 'Demo completada - Arquitectura hexagonal funcionando', 'sys');
        setAutoPlay(false);
        
      } catch (error) {
        console.error('Error in demo:', error);
        addLog('SYSTEM', 'Error en demo', 'sys');
        setAutoPlay(false);
      }
    };

    runDemo();

    return () => setAutoPlay(false);
  }, [autoPlay]);

  // Network particles effect
  useEffect(() => {
    const interval = setInterval(() => {
      setNetworkParticles(prev => {
        const newParticles = [...prev.filter(p => p.opacity > 0)];
        
        // Add new particles
        if (Math.random() > 0.7) {
          newParticles.push({
            id: Date.now(),
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: 1
          });
        }
        
        // Fade existing particles
        return newParticles.map(p => ({ ...p, opacity: p.opacity - 0.02 }));
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 font-mono selection:bg-rose-500/30" style={{ height: '100vh', width: '100vw', overflow: 'hidden', position: 'fixed', top: 0, left: 0 }}>
      
      {/* Header */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6 backdrop-blur-sm z-20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-rose-500 to-orange-500 flex items-center justify-center shadow-lg shadow-rose-500/20 animate-pulse">
            <Database size={18} className="text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">NanoDB <span className="text-rose-400">Protocol Arena</span></h1>
            <div className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-2">
              Hexagonal Architecture Core
              <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[8px] font-bold">RUST</span>
              <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[8px] font-bold">ASYNC</span>
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
             <span className="text-xs text-slate-300">{metrics.latency}ms</span>
          </div>
           {/* Speed Control */}
           <select 
             value={demoSpeed} 
             onChange={(e) => setDemoSpeed(Number(e.target.value))}
             className="px-2 py-1 bg-slate-900 border border-slate-700 rounded text-xs text-slate-300 focus:border-blue-500"
           >
             <option value={0.5}>0.5x</option>
             <option value={1}>1x</option>
             <option value={2}>2x</option>
           </select>
           
           {/* Stats Toggle */}
           <button 
             onClick={() => setShowStats(!showStats)}
             className={`px-3 py-1.5 rounded text-xs font-bold transition-all border ${
               showStats ? 'bg-blue-500/10 border-blue-500 text-blue-400' : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-blue-500'
             }`}
           >
             STATS
           </button>
           
           {/* Fullscreen Toggle */}
           <button 
             onClick={() => {
               if (!document.fullscreenElement) {
                 document.documentElement.requestFullscreen();
                 setIsFullscreen(true);
               } else {
                 document.exitFullscreen();
                 setIsFullscreen(false);
               }
             }}
             className="px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-400 hover:border-purple-500 hover:text-purple-400 rounded text-xs font-bold transition-all"
           >
             {isFullscreen ? '⛶' : '⛶'} FULL
           </button>
           
           {/* Auto Demo Button */}
           <button 
            onClick={() => setAutoPlay(!autoPlay)}
            className={`flex items-center gap-2 px-4 py-1.5 rounded text-xs font-bold transition-all border
              ${autoPlay 
                ? 'bg-red-500/10 border-red-500 text-red-400 hover:bg-red-500/20' 
                : 'bg-emerald-500/10 border-emerald-500 text-emerald-400 hover:bg-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
              }`}
          >
            {autoPlay ? <Pause size={14}/> : <Play size={14}/>}
            {autoPlay ? 'STOP' : 'DEMO'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex relative" style={{ height: 'calc(100vh - 4rem)' }}>
        
        {/* Stats Panel (Overlay) */}
        {showStats && (
          <div className="absolute top-20 left-4 z-30 bg-slate-900/95 border border-slate-700 rounded-lg p-4 backdrop-blur-sm max-w-sm">
            <h3 className="text-sm font-bold text-slate-300 mb-3">📊 System Internals</h3>
            
            {/* Technical Implementation Details */}
            <div className="mb-4 p-2 bg-slate-800/50 rounded text-[10px]">
              <div className="text-blue-300 font-bold mb-1">🧠 Core Engine:</div>
              <div className="text-slate-300">DashMap&lt;String, String&gt; - Lock-free</div>
              <div className="text-slate-300">Tokio async runtime - {metrics.connections} tasks</div>
              <div className="text-slate-300">Zero-copy string operations</div>
            </div>
            
            <div className="mb-4 p-2 bg-slate-800/50 rounded text-[10px]">
              <div className="text-emerald-300 font-bold mb-1">🌐 Network Layer:</div>
              <div className="text-slate-300">TCP: Custom binary protocol</div>
              <div className="text-slate-300">HTTP: Axum + JSON parsing</div>
              <div className="text-slate-300">gRPC: Protobuf serialization</div>
            </div>
            
            {/* Mini Throughput Graph */}
            <div className="mb-4">
              <div className="text-[10px] text-slate-400 mb-1">Throughput (ops/sec)</div>
              <div className="h-8 bg-slate-800 rounded flex items-end gap-0.5 px-1">
                {Array.from({length: 20}, (_, i) => (
                  <div key={i} className="flex-1 bg-blue-500 rounded-t" 
                       style={{height: `${Math.random() * 100}%`, opacity: 0.7}}></div>
                ))}
              </div>
            </div>
            
            <div className="space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Async Tasks:</span>
                <span className="text-white font-mono">{totalPackets}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Lock Contention:</span>
                <span className="text-emerald-400 font-mono">0.0%</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">GC Pressure:</span>
                <span className="text-blue-400 font-mono">Low</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Memory Safety:</span>
                <span className="text-rose-400 font-mono">Rust ✓</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Error Rate:</span>
                <span className="text-amber-400 font-mono">0.01%</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Uptime:</span>
                <span className="text-green-400 font-mono">99.99%</span>
              </div>
            </div>
          </div>
        )}
        
        {/* Network Particles */}
        {networkParticles.map(particle => (
          <div key={particle.id}
               className="absolute w-1 h-1 bg-blue-400 rounded-full pointer-events-none"
               style={{
                 left: `${particle.x}%`,
                 top: `${particle.y}%`,
                 opacity: particle.opacity,
                 animation: 'float 3s ease-in-out infinite'
               }}>
          </div>
        ))}
        
        {/* Main Canvas Area */}
        
        {/* Main Canvas Area */}
        <div className="flex-1 relative bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
            
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20" 
                 style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
            </div>

            {/* Connecting Lines (SVG) - Mejoradas */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
               <defs>
                 <linearGradient id="gradTcp" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#3B82F6" stopOpacity={activeProtocol === 'tcp' ? "0.8" : "0.2"}/>
                   <stop offset="100%" stopColor="#F43F5E" stopOpacity={activeProtocol === 'tcp' ? "0.8" : "0.2"}/>
                 </linearGradient>
                 <linearGradient id="gradHttp" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#10B981" stopOpacity={activeProtocol === 'http' ? "0.8" : "0.2"}/>
                   <stop offset="100%" stopColor="#F43F5E" stopOpacity={activeProtocol === 'http' ? "0.8" : "0.2"}/>
                 </linearGradient>
                 <linearGradient id="gradGrpc" x1="0%" y1="0%" x2="100%" y2="0%">
                   <stop offset="0%" stopColor="#F59E0B" stopOpacity={activeProtocol === 'grpc' ? "0.8" : "0.2"}/>
                   <stop offset="100%" stopColor="#F43F5E" stopOpacity={activeProtocol === 'grpc' ? "0.8" : "0.2"}/>
                 </linearGradient>
               </defs>
               {/* Lines with dynamic opacity */}
               <line x1="20%" y1="30%" x2="50%" y2="50%" stroke="url(#gradTcp)" strokeWidth={activeProtocol === 'tcp' ? "4" : "2"} strokeDasharray="5,5" className={activeProtocol === 'tcp' ? 'animate-pulse' : ''} />
               <line x1="80%" y1="30%" x2="50%" y2="50%" stroke="url(#gradHttp)" strokeWidth={activeProtocol === 'http' ? "4" : "2"} strokeDasharray="5,5" className={activeProtocol === 'http' ? 'animate-pulse' : ''} />
               <line x1="50%" y1="80%" x2="50%" y2="50%" stroke="url(#gradGrpc)" strokeWidth={activeProtocol === 'grpc' ? "4" : "2"} strokeDasharray="5,5" className={activeProtocol === 'grpc' ? 'animate-pulse' : ''} />
            </svg>

            {/* --- NODES --- */}

            {/* TCP Node */}
            <div className="absolute top-[30%] left-[20%] -translate-x-1/2 -translate-y-1/2 text-center group">
               <button 
                  onClick={() => triggerFlow('tcp')}
                  disabled={!!activeProtocol}
                  className={`relative w-24 h-24 rounded-2xl bg-slate-900 border-2 ${activeProtocol === 'tcp' ? 'border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.4)]' : 'border-slate-700 hover:border-blue-400'} flex flex-col items-center justify-center transition-all duration-300 z-10 group-hover:-translate-y-2`}>
                  <Terminal size={32} className="text-blue-500 mb-2" />
                  <span className="text-xs font-bold text-blue-400">TCP Handler</span>
                  <div className="absolute -top-3 px-2 py-0.5 bg-blue-900/80 rounded text-[10px] text-blue-200 border border-blue-700">:6379</div>
                  {activeProtocol === 'tcp' && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[8px] text-blue-300 font-mono bg-blue-900/20 px-1 rounded whitespace-nowrap">
                      Binary Parser Active
                    </div>
                  )}
               </button>
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
                      JSON Deserializing
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
                      Protobuf Decoding
                    </div>
                  )}
               </button>
            </div>

            {/* --- CORE HEXAGON --- */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center z-20">
                {/* Hexagon Shape CSS */}
                <div className={`relative w-40 h-44 transition-all duration-500
                    ${coreState === 'processing' ? 'scale-110' : 'scale-100'}
                `}>
                    {/* Outer Glow */}
                    <div className={`absolute inset-0 bg-rose-500/20 blur-xl rounded-full transition-opacity duration-300 ${coreState === 'processing' ? 'opacity-100' : 'opacity-20'}`}></div>
                    
                    {/* Hexagon BG */}
                    <div className="w-full h-full bg-slate-900 border-2 border-rose-500/50 flex flex-col items-center justify-center relative overflow-hidden"
                         style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                        
                        {/* Inner Pulse */}
                        {coreState === 'processing' && (
                            <div className="absolute inset-0 bg-rose-500/10 animate-pulse"></div>
                        )}
                        
                        <div className="z-10 flex flex-col items-center relative">
                           <ShieldCheck size={40} className={`mb-2 transition-colors ${coreState === 'processing' ? 'text-white' : 'text-rose-500'}`} />
                           <h2 className="text-lg font-black text-rose-500 tracking-wider">CORE</h2>
                           <span className="text-[9px] text-rose-300/70 mt-1">Thread Safe</span>
                           <div className="text-[8px] text-rose-400 mt-1 font-bold">
                             DashMap | {metrics.connections} async tasks
                           </div>
                           <div className="text-[7px] text-rose-300/50 mt-0.5">
                             Lock-free • Zero-copy • Memory-safe
                           </div>
                           {/* Pulse Effect */}
                           {coreState === 'processing' && (
                             <div className="absolute -inset-8 border-2 border-rose-500/30 rounded-full animate-ping"></div>
                           )}
                           
                           {/* Status Indicator */}
                           <div className="mt-2 flex gap-1">
                              <div className={`w-1.5 h-1.5 rounded-full ${coreState !== 'idle' ? 'bg-rose-400 animate-bounce' : 'bg-slate-700'}`}></div>
                              <div className={`w-1.5 h-1.5 rounded-full ${coreState !== 'idle' ? 'bg-rose-400 animate-bounce delay-75' : 'bg-slate-700'}`}></div>
                              <div className={`w-1.5 h-1.5 rounded-full ${coreState !== 'idle' ? 'bg-rose-400 animate-bounce delay-150' : 'bg-slate-700'}`}></div>
                           </div>
                        </div>

                        {/* Thread Animation Lines */}
                         <div className="absolute inset-0 opacity-10 bg-[linear-gradient(0deg,transparent_40%,#f43f5e_50%,transparent_60%)] bg-[length:100%_4px] animate-[scan_2s_linear_infinite]"></div>
                         
                         {/* Memory Management Indicator */}
                         {coreState === 'processing' && (
                           <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[6px] text-rose-300 font-mono bg-rose-900/20 px-1 rounded">
                             HEAP: {metrics.memory.toFixed(0)}% | GC: OFF
                           </div>
                         )}
                    </div>
                </div>
            </div>

            {/* --- FLYING PACKETS (Mejorados) --- */}
            {packets.map(p => {
                const pos = {
                    tcp: { top: '30%', left: '20%' },
                    http: { top: '30%', left: '80%' },
                    grpc: { top: '80%', left: '50%' },
                    core: { top: '50%', left: '50%' }
                };
                
                const start = pos[p.from];
                const end = pos[p.to];
                
                // Colores por protocolo
                const colors = {
                    tcp: 'bg-blue-500 shadow-[0_0_20px_#3B82F6]',
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
        <div className="w-96 lg:w-96 md:w-80 sm:w-72 bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl z-20 min-w-0">
           {/* Terminal Header */}
           <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between">
              <span className="text-xs font-mono text-slate-400 flex items-center gap-2">
                 <Terminal size={12} /> nanodb-cli
              </span>
              <div className="flex gap-1.5">
                 <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                 <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/50"></div>
              </div>
           </div>

           {/* Logs Area */}
           <div className="flex-1 p-4 font-mono text-[11px] overflow-y-auto space-y-3 custom-scrollbar max-h-full">
              <div className="text-slate-500 italic"># Esperando comandos...</div>
              
              {logs.map((log, i) => (
                  <div key={i} className="animate-in fade-in slide-in-from-left-2 duration-300">
                      <div className="flex gap-2 opacity-50 mb-0.5">
                          <span className="text-slate-500">[{log.time}]</span>
                          <span className={`font-bold 
                              ${log.source === 'TCP' ? COLORS.tcp : ''}
                              ${log.source === 'HTTP' ? COLORS.http : ''}
                              ${log.source === 'GRPC' ? COLORS.grpc : ''}
                              ${log.source === 'CORE' ? COLORS.core : ''}
                              ${log.source === 'SYSTEM' ? 'text-slate-300' : ''}
                          `}>{log.source}</span>
                      </div>
                      <div className={`pl-2 border-l-2 py-1
                          ${log.type === 'req' ? 'border-slate-700 text-slate-300' : ''}
                          ${log.type === 'res' ? 'border-emerald-500/50 text-emerald-300' : ''}
                          ${log.type === 'core' ? 'border-rose-500/50 text-rose-300' : ''}
                          ${log.type === 'sys' ? 'border-yellow-500/50 text-yellow-100 bg-yellow-900/10' : ''}
                      `}>
                          {log.message}
                      </div>
                  </div>
              ))}
              <div ref={logEndRef} />
           </div>

           {/* Resources Footer */}
           <div className="h-32 bg-slate-900/50 border-t border-slate-800 p-4">
              <h3 className="text-[10px] uppercase text-slate-500 font-bold mb-3 tracking-wider">System Resources</h3>
              
              {/* Memory Bar */}
              <div className="mb-3">
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Heap Memory</span>
                      <span>{metrics.memory.toFixed(1)} MB</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${metrics.memory}%` }}></div>
                  </div>
              </div>

              {/* Connections */}
              <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                      <span>Active Pools</span>
                      <span>{metrics.connections} threads</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${metrics.connections / 10}%` }}></div>
                  </div>
              </div>
           </div>
        </div>

      </div>
      
      {/* Professional Watermark */}
      <div className="absolute bottom-4 right-4 z-30 text-[10px] text-slate-500 font-mono flex items-center gap-2">
        <span>Built by</span>
        <span className="text-slate-300 font-bold">@fabianbele2605</span>
        <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
        <span>github.com/fabianbele2605</span>
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
        @keyframes scan {
            from { background-position: 0 0; }
            to { background-position: 0 -20px; }
        }
        
        @keyframes dataFlow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        
        .protocol-glow {
          filter: drop-shadow(0 0 8px currentColor);
        }
        
        /* Prevent page scroll */
        * {
          box-sizing: border-box;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
        }
        
        @keyframes networkPulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
};

export default NanoDBArena;