// Exports públicos
pub use storage::NanoDb;
pub use operations::{DbOperation, DbResult};
pub use metrics::{Metrics, MetricsSnapshot};

// Módulos
pub mod storage;
pub mod operations;
pub mod metrics;

#[cfg(test)]
mod tests {
    use super::*;

    #[tokio::test]
    async fn test_set_and_get() {
        let db = NanoDb::new();
        
        // Test SET
        let result = db.set("test_key".to_string(), b"test_value".to_vec()).await;
        assert!(matches!(result, DbResult::Ok(())));
        
        // Test GET
        let result = db.get("test_key").await;
        assert!(matches!(result, DbResult::Ok(ref data) if data == b"test_value"));
    }

    #[tokio::test]
    async fn test_get_nonexistent() {
        let db = NanoDb::new();
        
        let result = db.get("nonexistent").await;
        assert!(matches!(result, DbResult::NotFound));
    }

    #[tokio::test]
    async fn test_delete() {
        let db = NanoDb::new();
        
        // Set a value
        db.set("delete_me".to_string(), b"value".to_vec()).await;
        
        // Delete it
        let result = db.delete("delete_me").await;
        assert!(matches!(result, DbResult::Ok(())));
        
        // Verify it's gone
        let result = db.get("delete_me").await;
        assert!(matches!(result, DbResult::NotFound));
    }

    #[tokio::test]
    async fn test_keys() {
        let db = NanoDb::new();
        
        // Add some keys
        db.set("key1".to_string(), b"value1".to_vec()).await;
        db.set("key2".to_string(), b"value2".to_vec()).await;
        
        // Get keys
        let result = db.keys().await;
        if let DbResult::Ok(keys) = result {
            assert_eq!(keys.len(), 2);
            assert!(keys.contains(&"key1".to_string()));
            assert!(keys.contains(&"key2".to_string()));
        } else {
            panic!("Expected Ok with keys");
        }
    }

    #[tokio::test]
    async fn test_clear() {
        let db = NanoDb::new();
        
        // Add some data
        db.set("key1".to_string(), b"value1".to_vec()).await;
        db.set("key2".to_string(), b"value2".to_vec()).await;
        
        // Clear all
        let result = db.clear().await;
        assert!(matches!(result, DbResult::Ok(())));
        
        // Verify empty
        let result = db.keys().await;
        if let DbResult::Ok(keys) = result {
            assert_eq!(keys.len(), 0);
        } else {
            panic!("Expected Ok with empty keys");
        }
    }

    #[tokio::test]
    async fn test_exists() {
        let db = NanoDb::new();
        
        // Test non-existent key
        let result = db.exists("nonexistent").await;
        assert!(matches!(result, DbResult::Ok(false)));
        
        // Add a key
        db.set("existing".to_string(), b"value".to_vec()).await;
        
        // Test existing key
        let result = db.exists("existing").await;
        assert!(matches!(result, DbResult::Ok(true)));
    }

    #[tokio::test]
    async fn test_concurrent_access() {
        use std::sync::Arc;
        
        let db = Arc::new(NanoDb::new());
        let mut handles = vec![];
        
        // Spawn multiple tasks
        for i in 0..10 {
            let db_clone = db.clone();
            let handle = tokio::spawn(async move {
                let key = format!("key_{}", i);
                let value = format!("value_{}", i).into_bytes();
                
                // Set value
                db_clone.set(key.clone(), value.clone()).await;
                
                // Get value back
                let result = db_clone.get(&key).await;
                matches!(result, DbResult::Ok(ref data) if data == &value)
            });
            handles.push(handle);
        }
        
        // Wait for all tasks
        for handle in handles {
            let success = handle.await.unwrap();
            assert!(success);
        }
        
        // Verify all keys exist
        let result = db.keys().await;
        if let DbResult::Ok(keys) = result {
            assert_eq!(keys.len(), 10);
        }
    }
}