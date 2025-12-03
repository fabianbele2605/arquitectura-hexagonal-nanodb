// Importaciones
use nanodb_core::DbOperation;

// Estado de parsing para cada conexion
pub struct ProtocolParser {
    state: ParseState,
    buffer: Vec<u8>,        // Buffer de entrada
    current_opcode: Option<u8>, // Opcode actual
    current_key: Option<String>, // Clave actual
}

// Estados de parsing
#[derive(Debug)]
enum ParseState {
    ReadingOpCode,                      // Necesita 1 byte
    ReadingKeyLength,                   // Necesita 2 bytes
    ReadingKey { expected: u16 },       // Necesita N bytes
    ReadingValueLength,                 // Necesita 4 bytes
    ReadingValue { expected: u32 },     // Necesita N bytes
}

// Logica de parsing
impl ProtocolParser {
    pub fn new() -> Self {
        Self {
            state: ParseState::ReadingOpCode,
            buffer: Vec::new(),
            current_opcode: None,
            current_key: None,
        }
    }
    // Función principal
    pub fn feed_bytes(&mut self, new_bytes: &[u8]) -> Vec<DbOperation> {
        // 1. Agregar nuevos bytes al buffer
        self.buffer.extend_from_slice(new_bytes);
        // 2. Procesar comandos
        let mut commands = Vec::new();
        
        // 3. Procesar comandos mientras sea posible
        loop {
            match self.try_parse_command() {
                Some(command) => {
                    commands.push(command);
                }
                None => {
                    break;
                }
            }
        }
        // 4. Devolver comandos
        commands
    }
    
    // Función auxiliar
    fn try_parse_command(&mut self) -> Option<DbOperation> {
        loop {
            print!("Parser state: {:?}, buffer len: {}", self.state, self.buffer.len());
        // Aquí implementaremos la máquina de estados
        match self.state{
            ParseState::ReadingOpCode => {
                if self.buffer.len() < 1 {return None;}
                let opcode = self.buffer[0];
                print!("Opcode: {}", opcode);
                self.buffer.remove(0);
                self.current_opcode = Some(opcode);
                // Aquí devolveremos el comando
                match opcode {

                    4=> {
                        self.state = ParseState::ReadingOpCode;

                        return Some(DbOperation::Flush);
                    }
                    1=> {
                        self.state = ParseState::ReadingKeyLength;

                        
                    }
                    2=> {
                        self.state = ParseState::ReadingKeyLength;

                        
                    }
                    3=> {
                        self.state = ParseState::ReadingKeyLength;

                        
                    }
                    _=> {
                        self.state = ParseState::ReadingOpCode;
                        
                        return None;
                    }
                }
            }
            // Aquí implementaremos la máquina de estados
            ParseState::ReadingKeyLength => {
                print!("En ReadingKeyLength, buffer len: {}", self.buffer.len());
                if self.buffer.len() < 2 {return None;}
                let byte1 = self.buffer.remove(0);
                let byte2 = self.buffer.remove(0);
                let key_length = u16::from_be_bytes([byte1, byte2]);
                print!("Key length: {}", key_length);
                // Aquí devolveremos el comando
                self.state = ParseState::ReadingKey { expected: key_length };
                
            }
            // Aquí implementaremos la máquina de estados
            ParseState::ReadingKey{ expected } => {
                print!("En ReadingKey, esperando: {}, buffer len: {}", expected, self.buffer.len());
                if self.buffer.len() < expected as usize { return None;}
                let key_bytes:Vec<u8> = self.buffer.drain(0..expected as usize).collect();
                let key = String::from_utf8_lossy(&key_bytes).to_string();
                print!("Key parseado: {}", key);
                self.current_key = Some(key);
                // Aquí devolveremos el comando
                self.state = ParseState::ReadingValueLength;
                
            }
            // Aquí implementaremos la máquina de estados
            ParseState::ReadingValueLength => {
                if self.buffer.len() < 4 { return None;}
                let byte1 = self.buffer.remove(0);
                let byte2 = self.buffer.remove(0);
                let byte3 = self.buffer.remove(0);
                let byte4 = self.buffer.remove(0);
                let value_length = u32::from_be_bytes([byte1, byte2, byte3, byte4]);
                // Aquí devolveremos el comando
                self.state = ParseState::ReadingValue { expected: value_length };
                
            }
            // Aquí implementaremos la máquina de estados
            ParseState::ReadingValue{ expected } => {
                if self.buffer.len() < expected as usize { return None;}
                let value_bytes:Vec<u8> = self.buffer.drain(0..expected as usize).collect();
                // Usar los valores almacenados
                let opcode = self.current_opcode.take().unwrap();
                let key = self.current_key.take().unwrap();

                // Construir el comando segun el opcode
                let command = match opcode {
                    1 => DbOperation::Get { key, default: None },
                    2 => DbOperation::Set { key, value: value_bytes },
                    3 => DbOperation::Delete { key },
                    _ => return None, // Otro opcode no soportado
                };

                // Reset state y retornar
                self.state = ParseState::ReadingOpCode;
                return Some(command);
            }
        }
        }
    }
}
// Tests
#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn test_flush_command() {
        let mut parser = ProtocolParser::new();
        let commands = parser.feed_bytes(&[4]);
        assert_eq!(commands.len(), 1);
        assert_eq!(commands[0], DbOperation::Flush);
    }
    // Comando SET
    #[test]
    fn test_incomplete_command() {
        let mut parser = ProtocolParser::new();
        // Solo enviar opcode SET (1), sin mas datos
        let commands = parser.feed_bytes(&[1]);
        // No debe retornar comandos (esperando mas datos)
        assert_eq!(commands.len(), 0);
    }
}