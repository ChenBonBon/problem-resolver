pub mod routes {
    use actix_web::{
        web::{self, Json},
        Responder, Result,
    };

    use crate::common::common::{Resp, RespResult};

    pub fn problem_config(config: &mut web::ServiceConfig) {
        config
            .service(web::resource("/").route(web::get().to(get_all_problems)))
            .service(web::resource("/{id}").route(web::get().to(get_problem)));
    }

    async fn get_all_problems() -> RespResult {
        Resp::ok({}).to_json_result()
    }

    async fn get_problem(_problem_id: String) -> RespResult {
        Resp::ok({}).to_json_result()
    }
}
