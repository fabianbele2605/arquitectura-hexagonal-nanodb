// Importaciones
use nanodb_server_tcp::run_server;

// Funcion principal
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("Iniciando servidor TCP en puerto 8080...");
    run_server().await
}