use actix_web::{middleware::Logger, web, App, HttpServer};
use dotenv::dotenv;
use mongodb::Client;
use problem::problem::config as problem_config;
use std::env;
use user::user::config as user_config;
use serde::Serialize;

pub mod problem;
pub mod user;
pub mod utils;

#[derive(Debug)]
struct Global {
    db_name: String,
    user_collection_name: String,
}


#[derive(Serialize)]
struct Success {
    code: u8,
    message: String
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();

    let db_uri = env::var("DB_URI").unwrap_or_else(|_| "mongodb://localhost:27017".to_string());
    let db_name = env::var("DB_NAME").unwrap_or_else(|_| "problem_resolver".to_string());
    let user_collection_name =
        env::var("USER_COLLECTION_NAME").unwrap_or_else(|_| "user".to_string());
    let client = web::Data::new(Client::with_uri_str(&db_uri).await.expect("数据库连接失败"));
    let global = web::Data::new(Global {
        db_name,
        user_collection_name,
    });

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(global.clone())
            .app_data(client.clone())
            .configure(user_config)
            .configure(problem_config)
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
