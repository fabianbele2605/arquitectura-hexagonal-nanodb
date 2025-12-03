use std::sync::atomic::{AtomicU64, Ordering};
use std::sync::Arc;

#[derive(Debug, Default)]
pub struct Metrics {
    pub get_operations: AtomicU64,
    pub set_operations: AtomicU64,
    pub delete_operations: AtomicU64,
    pub keys_operations: AtomicU64,
    pub clear_operations: AtomicU64,
}

impl Metrics {
    pub fn new() -> Arc<Self> {
        Arc::new(Self::default())
    }

    pub fn increment_get(&self) {
        self.get_operations.fetch_add(1, Ordering::Relaxed);
    }

    pub fn increment_set(&self) {
        self.set_operations.fetch_add(1, Ordering::Relaxed);
    }

    pub fn increment_delete(&self) {
        self.delete_operations.fetch_add(1, Ordering::Relaxed);
    }

    pub fn increment_keys(&self) {
        self.keys_operations.fetch_add(1, Ordering::Relaxed);
    }

    pub fn increment_clear(&self) {
        self.clear_operations.fetch_add(1, Ordering::Relaxed);
    }

    pub fn get_stats(&self) -> MetricsSnapshot {
        MetricsSnapshot {
            get_operations: self.get_operations.load(Ordering::Relaxed),
            set_operations: self.set_operations.load(Ordering::Relaxed),
            delete_operations: self.delete_operations.load(Ordering::Relaxed),
            keys_operations: self.keys_operations.load(Ordering::Relaxed),
            clear_operations: self.clear_operations.load(Ordering::Relaxed),
        }
    }
}

#[derive(Debug, Clone)]
pub struct MetricsSnapshot {
    pub get_operations: u64,
    pub set_operations: u64,
    pub delete_operations: u64,
    pub keys_operations: u64,
    pub clear_operations: u64,
}

impl MetricsSnapshot {
    pub fn total_operations(&self) -> u64 {
        self.get_operations + self.set_operations + self.delete_operations 
            + self.keys_operations + self.clear_operations
    }
}