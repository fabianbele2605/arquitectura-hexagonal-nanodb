// Importaciones necesarias
use tokio::net::{TcpListener, TcpStream};
use std::sync::Arc;
use crate::protocol::ProtocolParser;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use nanodb_core::{NanoDb, DbResult, DbOperation};

// Emum para unificar respuestas 
enum CommandResult {
    Data(Vec<u8>),
    Success,
    NotFound,
    Err(String),
}

// Funcion principal del servidor
pub async fn run_server()-> Result<(), Box<dyn std::error::Error>> {
    // Crear base de deatos compartida
    let db = Arc::new(NanoDb::new());
    // Bind al puerto 6379
    let listener = TcpListener::bind("127.0.0.1:8080").await?;
    // Loop de aceptar conexiones
    loop {
        // Aceptar una conexion
        let (socket, _) = listener.accept().await?;
        // Clonar la base de datos compartida
        let db_clone = db.clone();
        // Crear un nuevo task para manejar la conexion
        tokio::spawn(async move {
            // Manejar la conexion
            handle_connection(socket, db_clone).await;
        });
    }
    // Nota: Este código nunca se alcanza debido al loop infinito
}
// Funcion para manejar una conexion
async fn handle_connection(
    mut socket: TcpStream,
    db: Arc<NanoDb>
) {
    // Crear parser para esta conexion
    let mut parser = ProtocolParser::new();

    // Loop de leer datos del socket
    loop {
        // Leer datos del socket
        let mut buffer = [0; 1024];
        let bytes_read = socket.read(&mut buffer).await.unwrap();
        // Si no hay datos, salir
        if bytes_read == 0 {
            break;
        }
        println!("Recibido {} bytes: {:?}", bytes_read, &buffer[..bytes_read]);
        
        // Parsear los datos
        let comando = parser.feed_bytes(&buffer[..bytes_read]);
        println!("Comandos parseados: {}", comando.len());

        // Procesar cada comando
        for comando in comando {
            // Ejecutar comando contra la base de datos
            let result = match comando {
                DbOperation::Get { key, .. } => {
                    match db.get(&key).await {
                        DbResult::Ok(data) => CommandResult::Data(data),
                        DbResult::NotFound => CommandResult::NotFound,
                        DbResult::Err(msg) => CommandResult::Err(msg),
                    }
                },
                DbOperation::Set { key, value, .. } => {
                    match db.set(key, value).await {
                        DbResult::Ok(_) => CommandResult::Success,
                        DbResult::NotFound => CommandResult::NotFound,
                        DbResult::Err(msg) => CommandResult::Err(msg),
                    }
                },
                DbOperation::Delete { key, .. } => {
                    match db.delete(&key).await {
                        DbResult::Ok(_) => CommandResult::Success,
                        DbResult::NotFound => CommandResult::NotFound,
                        DbResult::Err(msg) => CommandResult::Err(msg),
                
                    }
                },
                DbOperation::Flush => {
                    match db.clear().await {
                        DbResult::Ok(_) => CommandResult::Success,
                        DbResult::NotFound => CommandResult::NotFound,
                        DbResult::Err(msg) => CommandResult::Err(msg),
                    }
                },
                _ => {
                    // Otros comandos por implementar
                    CommandResult::Err("Command not implemented".to_string())
                }
            };

            // Enviar respuesta (por ahora simple)
            match result {
                CommandResult::Data(data) => {
                    let response = format!("DATA: {}\n", String::from_utf8_lossy(&data));
                    socket.write_all(response.as_bytes()).await.unwrap();
                },
                CommandResult::Success => socket.write_all(b"OK\n").await.unwrap(),
                CommandResult::NotFound => socket.write_all(b"NOT_FOUND\n").await.unwrap(),
                CommandResult::Err(msg) => {
                    let response = format!("ERROR: {}\n", msg);
                    socket.write_all(response.as_bytes()).await.unwrap();
                }
            }
        }
    }
}