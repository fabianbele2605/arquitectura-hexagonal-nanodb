// protocol-arena/tcp-client/src/main.rs
mod client;
mod serializer;

// Importaciones
use client::TcpClient;
use nanodb_core::DbOperation;

// Funcion principal
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Conectando al servidor...");
    // Conectar al servidor
    let mut client = TcpClient::connect("127.0.0.1:8080").await?;
    println!("Conectado al servidor.");

    // Prueba SET
    let set_cmd = DbOperation::Set {
        key: "cross-test".to_string(),
        value: b"hello world".to_vec(),
    };
    // Ejecutar comando
    let response = client.execute(set_cmd).await?;
    println!("SET response: {}", response);

    // Prueba GET
    let get_cmd = DbOperation::Get {
        key: "cross-test".to_string(),
        default: None,
    };
    // Ejecutar comando
    let response = client.execute(get_cmd).await?;
    println!("GET response: {}", response);
    
    // Retornar
    Ok(())
}