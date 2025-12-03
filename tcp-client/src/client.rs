// tcp-client/src/client.rs
use tokio::net::TcpStream;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use nanodb_core::DbOperation;
use crate::serializer::serialize_command;

// Definición de la estructura del cliente
pub struct TcpClient {
    stream: TcpStream,
}
// Implementación de la estructura
impl TcpClient {
    pub async fn connect(addr: &str) -> Result<Self, Box<dyn std::error::Error>> {
        // Conectar al servidor
        let stream = TcpStream::connect(addr).await?;
        Ok(TcpClient { stream })
    }
    // Funcion para ejecutar un comando
    pub async fn execute(&mut self, command: DbOperation) -> Result<String, Box<dyn std::error::Error>> {
        // Enviar comando y recibir respuesta
        // 1. Serializar el comando
        let bytes = serialize_command(&command);
        print!("Enviando {} bytes: {:?}", bytes.len(), bytes);

        // 2. Enviar al servidor
        self.stream.write_all(&bytes).await?;

        // 3. Pequeño delay para que el servidor procese
        tokio::time::sleep(tokio::time::Duration::from_millis(100)).await;

        // 4. Leer respuesta del servidor
        let mut buffer = [0; 1024];
        let bytes_read = self.stream.read(&mut buffer).await?;
        print!("Recibido {} bytes de respuesta", bytes_read);

        // 5. Convertir respuesta a string
        let response = String::from_utf8_lossy(&buffer[..bytes_read]);

        // 6. Retornar
        Ok(response.trim().to_string())
    }
}