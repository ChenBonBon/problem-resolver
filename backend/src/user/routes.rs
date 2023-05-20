pub mod routes {
    use actix_web::{get, post, web};
    use chrono::{Duration, Utc};
    use mongodb::Client;
    use serde::{Deserialize, Serialize};
    use tera::{Context, Tera};

    use crate::{
        common::common::{generate_code, Resp, RespResult, DB_NAME, VERIFICATION_COLLECTION, REGISTER_TEMPLATE},
        mail::mail::send_mail,
        user::models::Verication,
    };

    #[derive(Deserialize, Serialize)]
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
    async fn register(client: web::Data<Client>, data: web::Json<RegisterData>) -> RespResult {
        let tera = match Tera::new("templates/**/*.html") {
            Ok(t) => t,
            Err(e) => {
                println!("Parsing error(s): {}", e);
                ::std::process::exit(1);
            }
        };

        let mut context = Context::new();
        let email = &data.email;
        let code = generate_code(6);

        context.insert("email", &email.to_string());
        context.insert("year", &2023);
        context.insert("code", &code);

        let collection = client
            .database(DB_NAME)
            .collection(VERIFICATION_COLLECTION);
        let now = Utc::now();
        let expired_time = now
            .checked_add_signed(Duration::days(1))
            .expect("Calculate expired_time error");
        let verication = Verication {
            code,
            email: email.to_string(),
            created_at: bson::DateTime::from_chrono(now),
            expired_at: bson::DateTime::from_chrono(expired_time),
            verified: false,
        };
        let result = collection.insert_one(verication, None).await;
        let html = tera.render(REGISTER_TEMPLATE, &context).expect(&format!("Render template {} error", REGISTER_TEMPLATE));
        let mail_body = html;

        match result {
            Ok(_) => send_mail(
                email.to_string(),
                "欢迎注册小镇做题家".to_string(),
                mail_body,
            ),
            Err(err) => {
                println!("Insert into problem-resolver verification error(s): {}", err);
                ::std::process::exit(1);
            },
        }

        Resp::ok({}).to_json_result()
    }

    #[post("/login")]
    async fn login(data: web::Json<LoginData>) -> RespResult {
        Resp::ok({}).to_json_result()
    }
}
