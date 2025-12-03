// Operaciones de la base de datos
#[derive(Debug, Clone, PartialEq)]
pub enum DbOperation {
    Get { key: String, default: Option<Vec<u8>> },
    Set { key: String, value: Vec<u8> },
    Delete { key: String },
    Exists { key: String },
    Flush,
    Keys,
    KeysCursor { prefix: Option<String>, cursor: Option<String>, limit: usize },
    KeysPrefix { prefix: String },
    Values,
    ValuesPrefix { prefix: String },
    GetPrefix { prefix: String },
    DeletePrefix { prefix: String },
    Size,
    CompareAndSwap { key: String, old_value: Option<Vec<u8>>, new_value: Option<Vec<u8>> }

}

// Resultados de las operaciones
#[derive(Debug, Clone)]
pub enum DbResult <T> {
    Ok(T),
    Err(String),
    NotFound
}
