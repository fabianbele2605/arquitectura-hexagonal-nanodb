use nanodb_core::DbOperation;

// Constantes del protocolo (igual que en el servidor)
const OP_GET: u8 = 1;
const OP_SET: u8 = 2;
const OP_DELETE: u8 = 3;
const OP_FLUSH: u8 = 4;

pub fn serialize_command(op: &DbOperation) -> Vec<u8> {
    // Convertir DbOperation a bytes segun nuestra protocolo
    let mut bytes = Vec::new();

    match op {
        DbOperation::Set { key, value } => {
            // 1. Opcode
            bytes.push(OP_SET);

            // 2. Key length (2 bytes, big-endian)
            let key_len = key.len() as u16;
            bytes.extend_from_slice(&key_len.to_be_bytes());

            // 3. Key bytes
            bytes.extend_from_slice(key.as_bytes());

            // 4. Value length (4 bytes, big-endian)
            let value_len = value.len() as u32;
            bytes.extend_from_slice(&value_len.to_be_bytes());

            // 5. Value bytes
            bytes.extend_from_slice(value);
        },

        DbOperation::Get { key, .. } => {
            // GET tambien nesecita key, pero no value
            bytes.push(OP_GET);
            let key_len = key.len() as u16;
            bytes.extend_from_slice(&key_len.to_be_bytes());
            bytes.extend_from_slice(key.as_bytes());
            // Para GET value_len = 0
            bytes.extend_from_slice(&0u32.to_be_bytes());
        },

        DbOperation::Delete { key } => {
            // Similar a GET
            bytes.push(OP_DELETE);
            let key_len = key.len() as u16;
            bytes.extend_from_slice(&key_len.to_be_bytes());
            bytes.extend_from_slice(key.as_bytes());
            // Para DELETE value_len = 0
            bytes.extend_from_slice(&0u32.to_be_bytes());
        },

        DbOperation::Flush => {
            // Solo opcode, sin key ni value
            bytes.push(OP_FLUSH);
            // Key length = 0
            bytes.extend_from_slice(&0u16.to_be_bytes());
            // Value length = 0
            bytes.extend_from_slice(&0u32.to_be_bytes());
        },
        _ => {
            // Otros comandos no implementados
            panic!("Command not supported for serialization");
        }
    }

    bytes
}