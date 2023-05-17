use actix_web::{web, App, HttpServer};
use mongodb::Client;
use problem::routes::routes::problem_config;
use user::routes::routes::user_config;

mod common;
mod mail;
mod problem;
mod user;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let uri = std::env::var("MONGODB_URI").unwrap_or_else(|_| "mongodb://localhost:27017".into());
    let client = Client::with_uri_str(uri).await.expect("failed to connect");

    HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(client.clone()))
            .service(web::scope("/users").configure(user_config))
            .service(web::scope("/problems").configure(problem_config))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
