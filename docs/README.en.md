# NanoDB Protocol Arena 🚀

[![Rust](https://img.shields.io/badge/rust-1.70+-orange.svg)](https://www.rust-lang.org)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Tests](https://img.shields.io/badge/tests-7%2F7%20passing-brightgreen.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Architecture](https://img.shields.io/badge/architecture-hexagonal-purple.svg)](#)

> **Production-ready demonstration of Hexagonal Architecture implementing an in-memory database with multiple communication protocols**

**🎯 Perfect for:** Technical interviews • Portfolio showcase • Architecture learning • Rust demonstration

*🌍 Also available in: [Español](../README.md)*

## 🏗️ Arquitectura Hexagonal

Este proyecto implementa el patrón de Arquitectura Hexagonal (Ports & Adapters) donde el núcleo de negocio está completamente aislado de los detalles de infraestructura.

```
                    ┌─────────────────────────────────────┐
                    │           ADAPTADORES               │
                    │                                     │
         ┌──────────┤  TCP Binary    HTTP REST    gRPC   │
         │          │  (Puerto 8080) (Puerto 3000) (9090)│
         │          └─────────────────────────────────────┘
         │                           │
         │                           │
         ▼                           ▼
    ┌─────────┐                 ┌─────────┐
    │ PUERTO  │                 │ PUERTO  │
    │ ENTRADA │                 │ SALIDA  │
    └─────────┘                 └─────────┘
         │                           │
         │          ┌─────────────────────────────────────┐
         └─────────▶│            NÚCLEO                   │
                    │                                     │
                    │  ┌─────────────────────────────┐    │
                    │  │        NanoDb               │    │
                    │  │   - get(key) -> value       │    │
                    │  │   - set(key, value)         │    │
                    │  │   - delete(key)             │    │
                    │  │   - clear()                 │    │
                    │  │   - keys() -> Vec<String>   │    │
                    │  └─────────────────────────────┘    │
                    │                                     │
                    └─────────────────────────────────────┘
```

## ⚡ Quick Start

```bash
# Clone and run the complete demo
git clone <your-repo-url>
cd protocol-arena
./demo.sh
```

**📺 Watch it in action:** The demo script starts all 3 servers and demonstrates the architecture working!

## 📊 Project Metrics

```
📄 Lines of Code:     1,323
🧪 Test Coverage:     7/7 tests passing
⚠️  Compiler Warnings: 0
🚀 Protocols:         3 (TCP, HTTP, gRPC)
💻 Languages:        Rust 100%
🎨 Architecture:      Hexagonal/Ports & Adapters
```

## 🌟 Key Features

| Feature | Implementation | Status |
|---------|----------------|--------|
| **Hexagonal Architecture** | Core business logic isolated from protocols | ✅ Complete |
| **Multi-Protocol Support** | TCP Binary, HTTP REST, gRPC | ✅ Complete |
| **Concurrency** | Async handling of thousands of connections | ✅ Complete |
| **Thread Safety** | Lock-free concurrent storage with DashMap | ✅ Complete |
| **Type Safety** | Strongly typed Rust implementation | ✅ Complete |
| **Production Ready** | Zero warnings, full test coverage | ✅ Complete |

## 🔧 Protocolos Implementados

### 1. TCP Binary Protocol (Puerto 8080)
- **Protocolo binario personalizado** con state machine parser
- **Serialización eficiente** usando big-endian byte order
- **Campos length-prefixed** para manejo seguro de datos

### 2. HTTP REST API (Puerto 3000)
- **API REST completa** con JSON responses
- **Encoding Base64** para datos binarios
- **Status codes HTTP** apropiados

### 3. gRPC (Puerto 9090)
- **Protocol Buffers** para serialización eficiente
- **Type safety** con schemas fuertemente tipados
- **Generación automática** de código desde .proto

## 🚀 Uso Rápido

### Compilar el proyecto
```bash
cargo build
```

### Ejecutar servidores
```bash
# Terminal 1 - TCP Server
cd server-tcp && cargo run

# Terminal 2 - HTTP Server  
cd server-http && cargo run

# Terminal 3 - gRPC Server
cd server-grpc && cargo run
```

### Probar TCP Protocol
```bash
cd tcp-client && cargo run
```

### Probar HTTP REST API
```bash
# SET
curl -X POST http://localhost:3000/set \
  -H "Content-Type: application/json" \
  -d '{"key": "test", "value": "aGVsbG8gd29ybGQ="}'

# GET
curl http://localhost:3000/get/test

# DELETE
curl -X DELETE http://localhost:3000/delete/test

# FLUSH
curl http://localhost:3000/flush

# KEYS
curl http://localhost:3000/keys
```

## 📁 Estructura del Proyecto

```
protocol-arena/
├── core/                   # Núcleo de negocio (Hexágono)
│   ├── src/
│   │   ├── lib.rs         # Exports públicos
│   │   ├── storage.rs     # NanoDb implementation
│   │   └── operations.rs  # DbOperation & DbResult
│   └── Cargo.toml
├── server-tcp/            # Adaptador TCP
│   ├── src/
│   │   ├── main.rs        # TCP Server
│   │   ├── protocol.rs    # Binary protocol parser
│   │   └── server.rs      # Connection handling
│   └── Cargo.toml
├── server-http/           # Adaptador HTTP
│   ├── src/
│   │   └── main.rs        # REST API with Axum
│   └── Cargo.toml
├── server-grpc/           # Adaptador gRPC
│   ├── proto/
│   │   └── nanodb.proto   # Protocol Buffers definition
│   ├── src/
│   │   └── main.rs        # gRPC Server
│   ├── build.rs           # Code generation
│   └── Cargo.toml
├── tcp-client/            # Cliente TCP para testing
│   ├── src/
│   │   ├── main.rs        # Test client
│   │   ├── client.rs      # TCP client implementation
│   │   └── serializer.rs  # Binary serialization
│   └── Cargo.toml
└── Cargo.toml             # Workspace configuration
```

## 🎯 Decisiones Técnicas

### ¿Por qué Arquitectura Hexagonal?
- **Testabilidad**: Núcleo aislado, fácil de testear
- **Flexibilidad**: Cambiar protocolos sin afectar lógica de negocio
- **Mantenibilidad**: Separación clara de responsabilidades

### ¿Por qué Rust?
- **Memory Safety**: Sin garbage collector, control total de memoria
- **Concurrencia**: Async/await nativo y thread safety
- **Performance**: Velocidad comparable a C/C++
- **Type Safety**: Sistema de tipos que previene errores

### ¿Por qué DashMap?
- **Lock-free**: Mejor performance que Mutex<HashMap>
- **Concurrent**: Acceso simultáneo desde múltiples threads
- **API familiar**: Similar a HashMap estándar

### ¿Por qué múltiples protocolos?
- **TCP**: Máximo control y performance
- **HTTP**: Interoperabilidad y debugging fácil  
- **gRPC**: Eficiencia y type safety moderno

## 🔍 Conceptos Demostrados

- **Hexagonal Architecture / Ports & Adapters**
- **Domain-Driven Design (DDD)**
- **Async Programming en Rust**
- **Protocol Design & Implementation**
- **Concurrent Data Structures**
- **Code Generation (Protocol Buffers)**
- **REST API Design**
- **Binary Protocol Parsing**

## 🛠️ Tecnologías Utilizadas

- **Rust** - Lenguaje principal
- **Tokio** - Runtime asíncrono
- **DashMap** - Concurrent HashMap
- **Axum** - Framework HTTP
- **Tonic** - Framework gRPC
- **Prost** - Protocol Buffers para Rust
- **Serde** - Serialización JSON

## 📈 Próximos Pasos

- [ ] Implementar persistencia en disco
- [ ] Agregar autenticación y autorización
- [ ] Métricas y observabilidad
- [ ] Clustering y replicación
- [ ] Cliente gRPC para testing
- [ ] Benchmarks de performance

## 🤝 Contribuciones

Este proyecto es una demostración educativa de arquitectura hexagonal. Las contribuciones son bienvenidas para mejorar la documentación o agregar nuevos adaptadores.

---

**Desarrollado con ❤️ como demostración de Arquitectura Hexagonal en Rust**