// Importaciones
use dashmap::DashMap;   // <- Import necesario
use crate::DbResult;   // <- Import de DbResult
use tracing::{info, debug, warn};

// Definicion de la base de datos
pub struct NanoDb {
    data: DashMap<String, Vec<u8>>,    // <- Dashmap (no Dashmap)
}


// Implementaciones
impl NanoDb {

    // Constructor
    pub fn new() -> Self {
        NanoDb {
            data: DashMap::new(),
        }
    }
    // Metodos
    pub async fn get(&self, key: &str) -> DbResult<Vec<u8>> {
        debug!(key = %key, "Getting value");
        match self.data.get(key) {
            Some(value) => {
                debug!(key = %key, size = value.len(), "Value found");
                DbResult::Ok(value.clone())
            },
            None => {
                debug!(key = %key, "Value not found");
                DbResult::NotFound
            },
        }
    }
    // Metodos
    pub async fn set(&self, key: String, value: Vec<u8>) -> DbResult<()> {
        debug!(key = %key, size = value.len(), "Setting value");
        self.data.insert(key.clone(), value);
        info!(key = %key, "Value set successfully");
        DbResult::Ok(())
    }
    // Metodos
    pub async fn delete(&self, key: &str) -> DbResult<()> {
        debug!(key = %key, "Deleting value");
        let existed = self.data.remove(key).is_some();
        if existed {
            info!(key = %key, "Value deleted successfully");
        } else {
            warn!(key = %key, "Attempted to delete non-existent key");
        }
        DbResult::Ok(())
    }
    // Metodos
    pub async fn clear(&self) -> DbResult<()> {
        let count = self.data.len();
        debug!(count = count, "Clearing all data");
        self.data.clear();
        info!(count = count, "All data cleared successfully");
        DbResult::Ok(())
    }
    // Metodos
    pub async fn exists(&self, key: &str) -> DbResult<bool> {
        DbResult::Ok(self.data.contains_key(key))
    }
    // Metodos
    pub async fn keys(&self) -> DbResult<Vec<String>> {
        let keys: Vec<String> = self.data.iter().map(|kv| kv.key().clone()).collect();
        debug!(count = keys.len(), "Retrieved keys");
        DbResult::Ok(keys)
    }
}