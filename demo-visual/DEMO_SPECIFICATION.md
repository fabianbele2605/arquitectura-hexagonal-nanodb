# 🎬 NanoDB: Protocol Arena - Demo Visual React

## 📋 Especificación Técnica para Animación Interactiva

### 🎯 **Objetivo**
Crear una demo visual interactiva que muestre la arquitectura hexagonal de **NanoDB: Protocol Arena** con múltiples protocolos conectándose al mismo core de almacenamiento.

---

## 🏗️ **Estructura del Proyecto React**

```
demo-visual/
├── src/
│   ├── components/
│   │   ├── HexagonalCore.jsx       # Núcleo central animado
│   │   ├── ProtocolNode.jsx        # Nodos de protocolo (TCP/HTTP/gRPC)
│   │   ├── DataFlow.jsx            # Animación de flujo de datos
│   │   ├── MetricsPanel.jsx        # Panel de métricas en tiempo real
│   │   ├── CodeTerminal.jsx        # Terminal simulado con comandos
│   │   └── Timeline.jsx            # Control de timeline de demo
│   ├── animations/
│   │   ├── hexagonPulse.js         # Animaciones del core
│   │   ├── dataPackets.js          # Paquetes de datos volando
│   │   └── protocolConnections.js  # Conexiones entre protocolos
│   ├── data/
│   │   ├── demoScript.js           # Script de la demostración
│   │   └── mockData.js             # Datos de ejemplo
│   └── styles/
│       ├── hexagonal.css           # Estilos del hexágono
│       ├── protocols.css           # Estilos de protocolos
│       └── animations.css          # Animaciones CSS
├── public/
│   └── assets/
│       ├── protocol-icons/         # Iconos TCP, HTTP, gRPC
│       └── logos/                  # Logo NanoDB
└── package.json
```

---

## 🎨 **Componentes Principales**

### **1. HexagonalCore.jsx**
```jsx
// Hexágono central que representa el core de NanoDB
// - Pulso animado cuando recibe datos
// - Indicador de operaciones activas
// - Visualización del estado interno (keys almacenadas)
```

### **2. ProtocolNode.jsx**
```jsx
// Nodos de protocolo alrededor del hexágono
// - TCP: Azul, ícono de terminal
// - HTTP: Verde, ícono de navegador
// - gRPC: Amarillo, ícono de rayo
// - Animación de "envío" de datos al core
```

### **3. DataFlow.jsx**
```jsx
// Partículas/paquetes de datos animados
// - Diferentes colores por protocolo
// - Trayectoria curva hacia el core
// - Efecto de "absorción" en el hexágono
```

### **4. MetricsPanel.jsx**
```jsx
// Panel de métricas en tiempo real
// - Operaciones por segundo (contador animado)
// - Latencia promedio (gráfico de línea)
// - Conexiones activas (número pulsante)
// - Memoria utilizada (barra de progreso)
```

---

## 📝 **Script de Demostración**

### **Escena 1: Introducción (0-8s)**
```javascript
const scene1 = {
  duration: 8000,
  actions: [
    { time: 0, action: 'fadeIn', target: 'logo' },
    { time: 2000, action: 'typeText', target: 'title', text: 'NanoDB: Protocol Arena' },
    { time: 4000, action: 'typeText', target: 'subtitle', text: 'Arquitectura Hexagonal en Acción' },
    { time: 6000, action: 'fadeIn', target: 'hexagonalCore' }
  ]
}
```

### **Escena 2: Arquitectura Overview (8-20s)**
```javascript
const scene2 = {
  duration: 12000,
  actions: [
    { time: 8000, action: 'animateIn', target: 'protocolNodes' },
    { time: 10000, action: 'showConnections', target: 'all' },
    { time: 12000, action: 'highlightCore', text: 'Core Compartido Thread-Safe' },
    { time: 15000, action: 'showProtocolLabels' },
    { time: 18000, action: 'pulseAll' }
  ]
}
```

### **Escena 3: Demo TCP (20-30s)**
```javascript
const scene3 = {
  duration: 10000,
  actions: [
    { time: 20000, action: 'highlightProtocol', target: 'tcp' },
    { time: 21000, action: 'showTerminal', command: 'SET user:1001 "Alice"' },
    { time: 23000, action: 'sendDataPacket', from: 'tcp', to: 'core', data: 'user:1001' },
    { time: 24000, action: 'coreResponse', message: 'OK' },
    { time: 25000, action: 'showTerminal', command: 'GET user:1001' },
    { time: 27000, action: 'sendDataPacket', from: 'core', to: 'tcp', data: '"Alice"' },
    { time: 28000, action: 'updateMetrics', ops: 2, latency: '0.8ms' }
  ]
}
```

### **Escena 4: Demo HTTP (30-40s)**
```javascript
const scene4 = {
  duration: 10000,
  actions: [
    { time: 30000, action: 'highlightProtocol', target: 'http' },
    { time: 31000, action: 'showHTTPRequest', method: 'POST', url: '/api/users', body: '{"name":"Bob"}' },
    { time: 33000, action: 'sendDataPacket', from: 'http', to: 'core', data: 'user:1002' },
    { time: 34000, action: 'coreResponse', message: '201 Created' },
    { time: 35000, action: 'showHTTPRequest', method: 'GET', url: '/api/users/1002' },
    { time: 37000, action: 'sendDataPacket', from: 'core', to: 'http', data: '{"name":"Bob"}' },
    { time: 38000, action: 'updateMetrics', ops: 4, latency: '1.2ms' }
  ]
}
```

### **Escena 5: Demo gRPC (40-50s)**
```javascript
const scene5 = {
  duration: 10000,
  actions: [
    { time: 40000, action: 'highlightProtocol', target: 'grpc' },
    { time: 41000, action: 'showGRPCCall', method: 'SetValue', params: '{key: "session:abc", value: "active"}' },
    { time: 43000, action: 'sendDataPacket', from: 'grpc', to: 'core', data: 'session:abc' },
    { time: 44000, action: 'coreResponse', message: 'Success' },
    { time: 45000, action: 'showGRPCCall', method: 'GetValue', params: '{key: "session:abc"}' },
    { time: 47000, action: 'sendDataPacket', from: 'core', to: 'grpc', data: '"active"' },
    { time: 48000, action: 'updateMetrics', ops: 6, latency: '0.9ms' }
  ]
}
```

### **Escena 6: Concurrencia (50-58s)**
```javascript
const scene6 = {
  duration: 8000,
  actions: [
    { time: 50000, action: 'showConcurrencyMode' },
    { time: 51000, action: 'multipleDataPackets', count: 20, protocols: ['tcp', 'http', 'grpc'] },
    { time: 53000, action: 'coreIntensePulse' },
    { time: 54000, action: 'updateMetrics', ops: 1000, latency: '0.5ms', connections: 500 },
    { time: 56000, action: 'showPerformanceStats' }
  ]
}
```

### **Escena 7: Conclusión (58-60s)**
```javascript
const scene7 = {
  duration: 2000,
  actions: [
    { time: 58000, action: 'fadeOutDetails' },
    { time: 59000, action: 'showGitHubLink', url: 'github.com/fabianbele2605/arquitectura-hexagonal-nanodb' },
    { time: 60000, action: 'fadeToBlack' }
  ]
}
```

---

## 🎨 **Especificaciones Visuales**

### **Paleta de Colores**
```css
:root {
  --tcp-color: #3B82F6;      /* Azul brillante */
  --http-color: #10B981;     /* Verde esmeralda */
  --grpc-color: #F59E0B;     /* Amarillo dorado */
  --core-color: #EF4444;     /* Rojo coral */
  --bg-dark: #0F172A;        /* Azul muy oscuro */
  --bg-light: #1E293B;       /* Azul oscuro */
  --text-primary: #F8FAFC;   /* Blanco casi puro */
  --text-secondary: #94A3B8; /* Gris claro */
}
```

### **Animaciones CSS**
```css
@keyframes hexagonPulse {
  0% { transform: scale(1); box-shadow: 0 0 20px var(--core-color); }
  50% { transform: scale(1.05); box-shadow: 0 0 40px var(--core-color); }
  100% { transform: scale(1); box-shadow: 0 0 20px var(--core-color); }
}

@keyframes dataPacketFly {
  0% { transform: translateX(0) translateY(0) scale(0); opacity: 0; }
  20% { opacity: 1; transform: scale(1); }
  80% { opacity: 1; }
  100% { transform: translateX(var(--target-x)) translateY(var(--target-y)) scale(0); opacity: 0; }
}

@keyframes protocolHighlight {
  0% { border-color: transparent; }
  50% { border-color: var(--protocol-color); box-shadow: 0 0 20px var(--protocol-color); }
  100% { border-color: transparent; }
}
```

---

## 📊 **Datos de Demostración**

### **Mock Data**
```javascript
export const demoData = {
  operations: [
    { protocol: 'tcp', command: 'SET user:1001 "Alice"', response: 'OK', latency: 0.8 },
    { protocol: 'tcp', command: 'GET user:1001', response: '"Alice"', latency: 0.6 },
    { protocol: 'http', method: 'POST', url: '/api/users', body: '{"name":"Bob"}', response: '201', latency: 1.2 },
    { protocol: 'http', method: 'GET', url: '/api/users/1002', response: '{"name":"Bob"}', latency: 0.9 },
    { protocol: 'grpc', method: 'SetValue', params: '{key:"session:abc",value:"active"}', response: 'Success', latency: 0.9 },
    { protocol: 'grpc', method: 'GetValue', params: '{key:"session:abc"}', response: '"active"', latency: 0.7 }
  ],
  metrics: {
    maxOps: 10000,
    avgLatency: 0.8,
    maxConnections: 1000,
    memoryUsage: 45
  }
}
```

---

## 🚀 **Tecnologías Recomendadas**

### **Core Stack**
```json
{
  "react": "^18.2.0",
  "framer-motion": "^10.16.0",
  "react-spring": "^9.7.0",
  "styled-components": "^6.0.0"
}
```

### **Animaciones**
```json
{
  "lottie-react": "^2.4.0",
  "react-transition-group": "^4.4.5",
  "gsap": "^3.12.0"
}
```

### **Visualización**
```json
{
  "recharts": "^2.8.0",
  "react-countup": "^6.4.0",
  "react-syntax-highlighter": "^15.5.0"
}
```

---

## 📱 **Responsive Design**

### **Breakpoints**
```css
/* Desktop: 1200px+ - Layout completo */
/* Tablet: 768px-1199px - Layout compacto */
/* Mobile: <768px - Layout vertical */
```

### **Adaptaciones Mobile**
- Hexágono más pequeño
- Protocolos en layout vertical
- Métricas en carousel
- Terminal simplificado

---

## 🎬 **Controles de Demo**

### **Timeline Control**
```jsx
// Barra de progreso interactiva
// Play/Pause button
// Speed control (0.5x, 1x, 2x)
// Scene jumper
```

### **Interactive Mode**
```jsx
// Click en protocolos para activar demo
// Hover effects en componentes
// Manual data packet sending
```

---

## 📦 **Entregables**

1. **Demo React completa** (60s animación)
2. **Modo interactivo** para exploración
3. **Export a video** (MP4 para LinkedIn)
4. **Responsive design** (desktop/mobile)
5. **GitHub Pages deployment** ready

---

## 🎯 **Próximo Paso**

¿Quieres que empiece creando:
1. **Setup inicial** del proyecto React
2. **Componente HexagonalCore** base
3. **Sistema de animaciones** con framer-motion

¿Por cuál empezamos?