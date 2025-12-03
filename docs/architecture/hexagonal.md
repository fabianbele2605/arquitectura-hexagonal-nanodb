# Arquitectura Hexagonal - Guía Detallada

## 🎯 Introducción

La **Arquitectura Hexagonal**, también conocida como **Puertos y Adaptadores**, es un patrón arquitectónico que busca crear aplicaciones débilmente acopladas y altamente testeable mediante el aislamiento del núcleo de negocio de las preocupaciones externas.

## 🏗️ Principios Fundamentales

### 1. Separación de Responsabilidades
- **Núcleo (Core)**: Contiene la lógica de negocio pura
- **Puertos (Ports)**: Interfaces que definen contratos
- **Adaptadores (Adapters)**: Implementaciones concretas de los puertos

### 2. Inversión de Dependencias
- El núcleo no depende de detalles externos
- Los adaptadores dependen del núcleo, no al revés
- Las dependencias apuntan hacia adentro

### 3. Testabilidad
- El núcleo puede ser testeado de forma aislada
- Los adaptadores pueden ser mockeados fácilmente
- Tests unitarios rápidos y confiables

## 🔧 Implementación en NanoDB

### Estructura del Núcleo

```rust
// core/src/storage.rs
pub struct NanoDb {
    data: DashMap<String, Vec<u8>>,
}

impl NanoDb {
    pub async fn get(&self, key: &str) -> DbResult<Vec<u8>>
    pub async fn set(&self, key: String, value: Vec<u8>) -> DbResult<()>
    pub async fn delete(&self, key: &str) -> DbResult<()>
    pub async fn clear(&self) -> DbResult<()>
    pub async fn keys(&self) -> DbResult<Vec<String>>
}
```

**Características del Núcleo:**
- ✅ Sin dependencias externas
- ✅ Lógica de negocio pura
- ✅ Thread-safe con DashMap
- ✅ Async/await nativo
- ✅ Tipos de resultado consistentes

### Puertos (Interfaces)

```rust
// core/src/operations.rs
#[derive(Debug, Clone)]
pub enum DbOperation {
    Get { key: String },
    Set { key: String, value: Vec<u8> },
    Delete { key: String },
    Flush,
    Keys,
}

#[derive(Debug, Clone)]
pub enum DbResult<T> {
    Ok(T),
    NotFound,
    Err(String),
}
```

**Ventajas de los Puertos:**
- 🎯 Contratos claros y explícitos
- 🔄 Fácil intercambio de implementaciones
- 📊 Consistencia entre adaptadores
- 🧪 Testabilidad mejorada

### Adaptadores Implementados

#### 1. Adaptador TCP (Puerto 8080)
```rust
// server-tcp/src/main.rs
async fn handle_connection(socket: TcpStream, db: Arc<NanoDb>) {
    // Parsea protocolo binario
    // Ejecuta operaciones en el núcleo
    // Retorna respuestas binarias
}
```

**Responsabilidades:**
- Parsing de protocolo binario
- Serialización/deserialización
- Manejo de conexiones TCP
- Traducción a llamadas del núcleo

#### 2. Adaptador HTTP (Puerto 3000)
```rust
// server-http/src/main.rs
async fn set_handler(
    State(db): State<AppState>, 
    Json(req): Json<SetRequest>
) -> Result<Json<StatusResponse>, StatusCode> {
    // Decodifica JSON/Base64
    // Ejecuta operación en el núcleo
    // Retorna respuesta HTTP
}
```

**Responsabilidades:**
- Manejo de requests HTTP
- Serialización JSON
- Codificación Base64
- Códigos de estado HTTP

#### 3. Adaptador gRPC (Puerto 9090)
```rust
// server-grpc/src/main.rs
#[tonic::async_trait]
impl nano_db_service_server::NanoDbService for NanoDbServiceImpl {
    async fn set(&self, request: Request<SetRequest>) 
        -> Result<Response<SetResponse>, Status> {
        // Procesa request gRPC
        // Ejecuta operación en el núcleo
        // Retorna response gRPC
    }
}
```

**Responsabilidades:**
- Manejo de Protocol Buffers
- Implementación de traits gRPC
- Gestión de streams
- Códigos de estado gRPC

## 🔄 Flujo de Datos

```
Cliente → Adaptador → Puerto → Núcleo → Puerto → Adaptador → Cliente
```

### Ejemplo: Operación SET via HTTP

1. **Cliente HTTP** envía POST a `/set`
2. **Adaptador HTTP** recibe request
3. **Adaptador HTTP** decodifica JSON/Base64
4. **Adaptador HTTP** llama `db.set(key, value)`
5. **Núcleo** almacena en DashMap
6. **Núcleo** retorna `DbResult::Ok(())`
7. **Adaptador HTTP** convierte a JSON response
8. **Cliente HTTP** recibe respuesta

## 🧪 Estrategia de Testing

### Tests del Núcleo
```rust
#[tokio::test]
async fn test_set_and_get() {
    let db = NanoDb::new();
    
    // Test directo del núcleo
    let result = db.set("key".to_string(), b"value".to_vec()).await;
    assert!(matches!(result, DbResult::Ok(())));
    
    let result = db.get("key").await;
    assert!(matches!(result, DbResult::Ok(ref data) if data == b"value"));
}
```

### Tests de Adaptadores
```rust
#[tokio::test]
async fn test_http_adapter() {
    let app = create_app();
    
    // Test del adaptador HTTP
    let response = app
        .oneshot(Request::builder()
            .method("POST")
            .uri("/set")
            .header("content-type", "application/json")
            .body(Body::from(r#"{"key": "test", "value": "dGVzdA=="}"#))
            .unwrap())
        .await
        .unwrap();
        
    assert_eq!(response.status(), StatusCode::OK);
}
```

## 📊 Beneficios Obtenidos

### 1. Flexibilidad
- ✅ Fácil agregar nuevos protocolos
- ✅ Cambiar implementaciones sin afectar el núcleo
- ✅ Soporte para múltiples versiones de API

### 2. Testabilidad
- ✅ Tests unitarios rápidos del núcleo
- ✅ Tests de integración por adaptador
- ✅ Mocking sencillo de dependencias

### 3. Mantenibilidad
- ✅ Separación clara de responsabilidades
- ✅ Código más legible y organizado
- ✅ Fácil debugging y troubleshooting

### 4. Escalabilidad
- ✅ Núcleo optimizado independientemente
- ✅ Adaptadores escalables por separado
- ✅ Fácil distribución en microservicios

## 🚀 Patrones Aplicados

### 1. Dependency Injection
```rust
// Los adaptadores reciben el núcleo como dependencia
let db = Arc::new(NanoDb::new());
let service = NanoDbServiceImpl::new(db);
```

### 2. Strategy Pattern
```rust
// Diferentes estrategias de serialización por adaptador
// TCP: Binario
// HTTP: JSON + Base64
// gRPC: Protocol Buffers
```

### 3. Command Pattern
```rust
// Operaciones encapsuladas como comandos
pub enum DbOperation {
    Get { key: String },
    Set { key: String, value: Vec<u8> },
    // ...
}
```

## 🎯 Lecciones Aprendidas

### ✅ Qué Funcionó Bien
- **DashMap**: Excelente para concurrencia sin locks
- **Async/await**: Manejo natural de I/O asíncrono
- **Type safety**: Rust previene muchos errores
- **Modularidad**: Fácil desarrollo en paralelo

### 🔄 Qué Mejoraríamos
- **Error handling**: Más granularidad en tipos de error
- **Configuración**: Sistema de configuración centralizado
- **Observabilidad**: Más métricas y tracing
- **Persistencia**: Capa de almacenamiento durable

## 📚 Referencias

- [Hexagonal Architecture (Alistair Cockburn)](https://alistair.cockburn.us/hexagonal-architecture/)
- [Clean Architecture (Robert Martin)](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Ports and Adapters Pattern](https://jmgarridopaz.github.io/content/hexagonalarchitecture.html)
- [Domain-Driven Design](https://domainlanguage.com/ddd/)

---

*← Volver a [README](../../README.md)*