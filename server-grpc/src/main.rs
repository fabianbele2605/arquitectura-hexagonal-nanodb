// protocol-arena/server-grpc/src/main.rs
use std::sync::Arc;
use nanodb_core::NanoDb;

// Codigo generado por prost_build
include!(concat!(env!("OUT_DIR"), "/nanodb.rs"));

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Iniciando servidor gRPC simple en puerto 9090...");
    
    // Crear base de datos compartida
    let _db = Arc::new(NanoDb::new());
    
    // Por ahora, servidor placeholder que demuestra que los structs funcionan
    let _test_request = SetRequest {
        key: "test".to_string(),
        value: b"test_value".to_vec(),
    };
    
    println!("Structs gRPC generados correctamente!");
    println!("SetRequest, GetResponse, etc. están disponibles");
    
    // Mantener el servidor corriendo
    tokio::time::sleep(tokio::time::Duration::from_secs(3600)).await;
    
    Ok(())
}
