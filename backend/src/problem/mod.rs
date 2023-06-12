pub mod problem {
    use actix_web::{get, web, HttpResponse};

    #[get("")]
    async fn index() -> HttpResponse {
        HttpResponse::Ok().body("index")
    }

    pub fn config(cfg: &mut web::ServiceConfig) {
        cfg.service(web::scope("problems").service(index));
    }
}
