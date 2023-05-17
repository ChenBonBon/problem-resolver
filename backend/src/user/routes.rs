const DB_NAME: &str = "problem-resolver";
const COLL_NAME: &str = "users";

pub mod routes {
    use actix_web::{get, post, web};
    use serde::Deserialize;
    use tera::{Context, Tera};

    use crate::{
        common::common::{Resp, RespResult},
        mail::mail::send_mail,
    };

    #[derive(Deserialize)]
    struct RegisterData {
        email: String,
    }

    #[derive(Deserialize)]
    struct LoginData {
        username: String,
        password: String,
    }

    pub fn user_config(config: &mut web::ServiceConfig) {
        config
            .service(get_all_users)
            .service(get_current_user)
            .service(register)
            .service(login);
    }

    #[get("/current")]
    async fn get_current_user() -> RespResult {
        Resp::ok({}).to_json_result()
    }

    #[get("/")]
    async fn get_all_users() -> RespResult {
        Resp::ok({}).to_json_result()
    }

    #[post("/register")]
    async fn register(data: web::Json<RegisterData>) -> RespResult {
        let tera = match Tera::new("templates/**/*.html") {
            Ok(t) => t,
            Err(e) => {
                println!("Parsing error(s): {}", e);
                ::std::process::exit(1);
            }
        };

        let mut context = Context::new();
        context.insert("email", &data.email.to_string());
        context.insert("year", &2023);
        let html = tera.render("user/register.html", &context);
        let mail_body = html.unwrap();

        send_mail(
            data.email.to_string(),
            "欢迎注册小镇做题家".to_string(),
            mail_body,
        );

        Resp::ok({}).to_json_result()
    }

    #[post("/login")]
    async fn login(data: web::Json<LoginData>) -> RespResult {
        Resp::ok({}).to_json_result()
    }
}
