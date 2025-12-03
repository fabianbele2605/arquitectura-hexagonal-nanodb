# NanoDB Protocol Arena 🚀

[![Rust](https://img.shields.io/badge/rust-1.70+-orange.svg)](https://www.rust-lang.org)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)
[![Tests](https://img.shields.io/badge/tests-7%2F7%20passing-brightgreen.svg)](#)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Architecture](https://img.shields.io/badge/architecture-hexagonal-purple.svg)](#)

> **Demostración lista para producción de Arquitectura Hexagonal implementando una base de datos en memoria con múltiples protocolos de comunicación**

**🎯 Perfecto para:** Entrevistas técnicas • Portafolio profesional • Aprendizaje de arquitectura • Demostración de Rust

## ⚡ Inicio Rápido

```bash
# Clonar y ejecutar la demostración completa
git clone https://github.com/fabianbele2605/arquitectura-hexagonal-nanodb
cd protocol-arena
./demo.sh
```

**📺 Véelo en acción:** El script de demo inicia los 3 servidores y demuestra la arquitectura funcionando!

## 📊 Métricas del Proyecto

```
📄 Líneas de Código:     1,323
🧪 Cobertura de Tests:   7/7 tests pasando
⚠️  Warnings del Compilador: 0
🚀 Protocolos:          3 (TCP, HTTP, gRPC)
💻 Lenguajes:           Rust 100%
🎨 Arquitectura:        Hexagonal/Puertos y Adaptadores
```

## 🏗️ Arquitectura Hexagonal

Este proyecto implementa el patrón de **Arquitectura Hexagonal** (también conocido como Puertos y Adaptadores) donde el núcleo de negocio está completamente aislado de los detalles de infraestructura.

```
                    ┌─────────────────────────────────────┐
                    │           ADAPTADORES               │
                    │                                     │
         ┌──────────┤  TCP Binario   HTTP REST    gRPC   │
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

## 🌟 Características Principales

| Característica | Implementación | Estado |
|----------------|----------------|--------|
| **Arquitectura Hexagonal** | Lógica de negocio aislada de protocolos | ✅ Completo |
| **Soporte Multi-Protocolo** | TCP Binario, HTTP REST, gRPC | ✅ Completo |
| **Concurrencia** | Manejo asíncrono de miles de conexiones | ✅ Completo |
| **Thread Safety** | Almacenamiento concurrente sin locks con DashMap | ✅ Completo |
| **Type Safety** | Implementación fuertemente tipada en Rust | ✅ Completo |
| **Listo para Producción** | Cero warnings, cobertura completa de tests | ✅ Completo |

## 🔧 Protocolos Implementados

### 1. Protocolo TCP Binario (Puerto 8080)
- **Protocolo binario personalizado** con parser de máquina de estados
- **Serialización eficiente** usando orden de bytes big-endian
- **Campos con prefijo de longitud** para manejo seguro de datos

### 2. API REST HTTP (Puerto 3000)
- **API REST completa** con respuestas JSON
- **Codificación Base64** para datos binarios
- **Códigos de estado HTTP** apropiados

### 3. gRPC (Puerto 9090)
- **Protocol Buffers** para serialización eficiente
- **Type safety** con esquemas fuertemente tipados
- **Generación automática** de código desde archivos .proto

## 🚀 Ejemplos de Uso

### 🎬 Demo Automatizado
```bash
./demo.sh  # Ejecuta demostración completa
```

### 🔧 Testing Manual
```bash
# Iniciar todos los servidores
cargo build --release
cd server-tcp && cargo run &
cd server-http && cargo run &
cd server-grpc && cargo run &
```

### 🌐 Ejemplos de API REST HTTP
```bash
# Almacenar datos
curl -X POST http://localhost:3000/set \
  -H "Content-Type: application/json" \
  -d '{"key": "usuario", "value": "aGVsbG8gd29ybGQ="}'

# Recuperar datos  
curl http://localhost:3000/get/usuario

# Listar todas las claves
curl http://localhost:3000/keys
```

**📝 Documentación de API:** Todos los endpoints soportan JSON con codificación Base64 para datos binarios

## 🎯 Decisiones Técnicas

### ¿Por qué Arquitectura Hexagonal?
- **Testabilidad**: Núcleo aislado, fácil de testear
- **Flexibilidad**: Cambiar protocolos sin afectar lógica de negocio
- **Mantenibilidad**: Separación clara de responsabilidades
- **Escalabilidad**: Fácil agregar nuevos adaptadores

### ¿Por qué Rust?
- **Memory Safety**: Sin recolector de basura, control total de memoria
- **Concurrencia**: Async/await nativo y thread safety
- **Performance**: Velocidad comparable a C/C++
- **Type Safety**: Sistema de tipos que previene errores en tiempo de compilación

### ¿Por qué DashMap?
- **Lock-free**: Mejor rendimiento que Mutex<HashMap>
- **Concurrente**: Acceso simultáneo desde múltiples threads
- **API familiar**: Similar a HashMap estándar de Rust

### ¿Por qué múltiples protocolos?
- **TCP**: Máximo control y rendimiento
- **HTTP**: Interoperabilidad y debugging fácil  
- **gRPC**: Eficiencia y type safety moderno

## 🔍 Conceptos Demostrados

- **Arquitectura Hexagonal / Puertos y Adaptadores**
- **Domain-Driven Design (DDD)**
- **Programación Asíncrona en Rust**
- **Diseño e Implementación de Protocolos**
- **Estructuras de Datos Concurrentes**
- **Generación de Código (Protocol Buffers)**
- **Diseño de API REST**
- **Parsing de Protocolos Binarios**
- **CI/CD con GitHub Actions**
- **Testing Automatizado**

## 🛠️ Tecnologías Utilizadas

- **Rust** - Lenguaje principal del sistema
- **Tokio** - Runtime asíncrono para concurrencia
- **DashMap** - HashMap concurrente sin locks
- **Axum** - Framework HTTP moderno
- **Tonic** - Framework gRPC para Rust
- **Prost** - Protocol Buffers para Rust
- **Serde** - Serialización JSON
- **Tracing** - Logging estructurado

## 📈 Roadmap Futuro

- [ ] Implementar capa de persistencia en disco
- [ ] Agregar autenticación y autorización JWT
- [ ] Sistema de métricas y observabilidad
- [ ] Clustering y replicación distribuida
- [ ] Cliente gRPC para testing completo
- [ ] Benchmarks de rendimiento
- [ ] Interfaz web de administración
- [ ] Soporte para transacciones ACID

## 🤝 Contribuciones

Este proyecto es una demostración educativa de arquitectura hexagonal. Las contribuciones son bienvenidas para mejorar la documentación, agregar nuevos adaptadores de protocolo, o implementar características adicionales.

Ver [CONTRIBUTING.md](../CONTRIBUTING.md) para guías detalladas de contribución.

## 📚 Documentación Adicional

- [Arquitectura Hexagonal Detallada](architecture/hexagonal.md)
- [Documentación de Protocolos](architecture/protocols.md)
- [API TCP Binaria](api/tcp-protocol.md)
- [API REST HTTP](api/http-api.md)
- [API gRPC](api/grpc-api.md)

## 📄 Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](../LICENSE) para detalles.

---

**Desarrollado con ❤️ como demostración de Arquitectura Hexagonal en Rust**

*🌍 También disponible en: [English](../README.md)*