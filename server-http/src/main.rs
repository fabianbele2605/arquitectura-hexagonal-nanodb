// Importaciones externas
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Json,
    routing::{get, post, delete},
    Router,
};

// Importaciones
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use nanodb_core::NanoDb;
use base64::{Engine as _, engine::general_purpose};
use tracing::info;

// Tipos para JSON
#[derive(Serialize, Deserialize)]
struct SetRequest {
    key: String,
    value: String,    // Base64
}

#[derive(Serialize)]
struct GetResponse {
    value: String,    // Base64
}

#[derive(Serialize)]
struct StatusResponse {
    success: bool,
    message: Option<String>,
}

// Estado compartido
type AppState = Arc<NanoDb>;

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt::init();
    
    tracing::info!("Iniciando servidor HTTP en puerto 3000...");

    // Crear base de datos compartida
    let db = Arc::new(NanoDb::new());

    // Crear router
    let app = Router::new()
        .route("/set", post(set_handler))
        .route("/get/{key}", get(get_handler))
        .route("/delete/{key}", delete(delete_handler))
        .route("/flush", get(flush_handler))
        .route("/keys", get(keys_handler))
        .with_state(db);

    // Iniciar el servidor
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000")
        .await
        .unwrap();

    info!("Servidor HTTP iniciado exitosamente en puerto 3000");
    axum::serve(listener, app).await.unwrap();
}

// Handlers (implementar despues)
async fn set_handler(State(db): State<AppState>, Json(req): Json<SetRequest>) -> Result<Json<StatusResponse>, StatusCode> {
    // 1. Decodificar Base64
    let value_bytes = match general_purpose::STANDARD.decode(&req.value) {
        Ok(bytes) => bytes,
        Err(_) => return Ok(Json(StatusResponse {
            success: false,
            message: Some("Invalid Base64".to_string()),
        })),
    };

    // 2. Ejecutar comando
    match db.set(req.key, value_bytes).await {
        // 3. Devolver respuesta
        nanodb_core::DbResult::Ok(_) => Ok(Json(StatusResponse {
            success: true,
            message: None,
        })),
        // 4. Devolver error
        nanodb_core::DbResult::Err(msg) => Ok(Json(StatusResponse {
            success: false,
            message: Some(msg),
        })),
        // 5. Devolver NotFound
        nanodb_core::DbResult::NotFound => Ok(Json(StatusResponse {
            success: false,
            message: Some("Unexpected NotFound".to_string()),
        })),
    }
}

// Handlers
async fn get_handler(State(db): State<AppState>, Path(key): Path<String>) -> Result<Json<GetResponse>, StatusCode> {
    match db.get(&key).await {
        nanodb_core::DbResult::Ok(value_bytes) => {
            let encoded_value = general_purpose::STANDARD.encode(value_bytes);
            Ok(Json(GetResponse {
                value: encoded_value,
            }))
        },
        nanodb_core::DbResult::NotFound => {
            Err(StatusCode::NOT_FOUND)
        },
        nanodb_core::DbResult::Err(_msg) => {
            Err(StatusCode::INTERNAL_SERVER_ERROR)
        },
    }
}

async fn delete_handler(State(db): State<AppState>, Path(key): Path<String>) -> Result<Json<StatusResponse>, StatusCode> {
    match db.delete(&key).await {
        nanodb_core::DbResult::Ok(_) => Ok(Json(StatusResponse {
            success: true,
            message: None,
        })),
        nanodb_core::DbResult::NotFound => Ok(Json(StatusResponse {
            success: false,
            message: Some("Key not found".to_string()),
        })),
        nanodb_core::DbResult::Err(msg) => Ok(Json(StatusResponse {
            success: false,
            message: Some(msg),
        })),
    }
}

async fn flush_handler(State(db): State<AppState>) -> Result<Json<StatusResponse>, StatusCode> {
    match db.clear().await {
        nanodb_core::DbResult::Ok(_) => Ok(Json(StatusResponse {
            success: true,
            message: None,
        })),
        nanodb_core::DbResult::NotFound => Ok(Json(StatusResponse {
            success: false,
            message: Some("Key not found".to_string()),
        })),
        nanodb_core::DbResult::Err(msg) => Ok(Json(StatusResponse {
            success: false,
            message: Some(msg),
        })),
    }
}

async fn keys_handler(State(db): State<AppState>) -> Result<Json<Vec<String>>, StatusCode> {
    match db.keys().await {
        nanodb_core::DbResult::Ok(keys) => Ok(Json(keys)),
        nanodb_core::DbResult::NotFound => Ok(Json(vec![])),
        nanodb_core::DbResult::Err(_msg) => Err(StatusCode::INTERNAL_SERVER_ERROR),
    }
}