pub mod routes {
    use std::ptr::eq;

    use actix_web::{get, post, web};
    use chrono::{Duration, Utc};
    use mongodb::{bson::doc, options::FindOneOptions, Client, Collection};
    use serde::{Deserialize, Serialize};
    use tera::{Context, Tera};

    use crate::{
        common::common::{
            generate_code, Resp, RespResult, DB_NAME, REGISTER_TEMPLATE, USER_COLLECTION,
            VERIFICATION_COLLECTION,
        },
        mail::mail::send_mail,
        user::models::{User, Verification},
    };

    #[derive(Deserialize, Serialize)]
    struct RegisterData {
        email: String,
        code: String,
        password: String,
    }

    #[derive(Deserialize, Serialize)]
    struct VerificationData {
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
            .service(verification)
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

    #[post("/verification")]
    async fn verification(
        client: web::Data<Client>,
        data: web::Json<VerificationData>,
    ) -> RespResult {
        let tera = match Tera::new("templates/**/*.html") {
            Ok(t) => t,
            Err(e) => {
                println!("Parsing error(s): {}", e);
                return Resp::err(500, "解析html模板失败").to_json_result();
            }
        };

        let mut context = Context::new();
        let email = &data.email;
        let code = generate_code(6);

        context.insert("email", &email.to_string());
        context.insert("year", &2023);
        context.insert("code", &code);

        let verification_collection = client.database(DB_NAME).collection(VERIFICATION_COLLECTION);
        let user_collection: Collection<User> =
            client.database(DB_NAME).collection(USER_COLLECTION);
        let now = Utc::now();
        let expired_time = now
            .checked_add_signed(Duration::days(1))
            .expect("Calculate expired_time error");
        let verification = Verification {
            code,
            email: email.to_string(),
            created_at: bson::DateTime::from_chrono(now),
            expired_at: bson::DateTime::from_chrono(expired_time),
            verified: false,
        };
        let filter = doc! { "email": email };
        let options = FindOneOptions::builder().build();
        let get_result = user_collection.find_one(filter, options).await;

        match get_result {
            Ok(res) => {
                if res == None {
                    let insert_result =
                        verification_collection.insert_one(verification, None).await;
                    let html = tera
                        .render(REGISTER_TEMPLATE, &context)
                        .expect(&format!("Render template {} error", REGISTER_TEMPLATE));
                    let mail_body = html;

                    match insert_result {
                        Ok(_) => {
                            send_mail(
                                email.to_string(),
                                "欢迎注册小镇做题家".to_string(),
                                mail_body,
                            );

                            return Resp::ok({}).to_json_result();
                        }
                        Err(err) => {
                            println!(
                                "Insert into {} {} error(s): {}",
                                DB_NAME, VERIFICATION_COLLECTION, err
                            );
                            return Resp::err(500, "获取验证码失败").to_json_result();
                        }
                    }
                } else {
                    return Resp::err(500, "该Email已注册，请直接登录").to_json_result();
                }
            }
            Err(err) => {
                println!("Get {} {} error(s): {}", DB_NAME, USER_COLLECTION, err);
                return Resp::err(500, "获取验证码失败").to_json_result();
            }
        }
    }

    #[post("/register")]
    async fn register(client: web::Data<Client>, data: web::Json<RegisterData>) -> RespResult {
        let email = &data.email;
        let code = &data.code;
        let password = &data.password;

        let verification_collection: Collection<Verification> =
            client.database(DB_NAME).collection(VERIFICATION_COLLECTION);
        let user_collection: Collection<User> =
            client.database(DB_NAME).collection(USER_COLLECTION);

        let filter = doc! { "email": email };
        let options = FindOneOptions::builder()
            .sort(doc! { "expired_at": -1 })
            .build();
        let result = verification_collection.find_one(filter, options).await;

        match result {
            Ok(res) => {
                let last_verification = res.expect("Get last verification error");
                let last_code = last_verification.code;
                let expired_at = last_verification.expired_at;
                let verified = last_verification.verified;
                let now = Utc::now();

                if code.to_string() == last_code {
                    if now < expired_at.to_chrono() {
                        if verified == false {
                            let query = doc! {"email": email, "code": code};
                            let update = doc! {"$set": { "verified": true }};
                            let update_res = verification_collection
                                .update_one(query, update, None)
                                .await;

                            match update_res {
                                Ok(_) => {
                                    let user = User {
                                        first_name: None,
                                        last_name: None,
                                        username: None,
                                        password: password.to_string(),
                                        email: email.to_string(),
                                        last_login_ip: None,
                                        last_login_at: None,
                                        created_at: bson::DateTime::from_chrono(now),
                                    };
                                    let insert_result =
                                        user_collection.insert_one(user, None).await;
                                    match insert_result {
                                        Ok(_) => {
                                            return Resp::ok({}).to_json_result();
                                        }
                                        Err(err) => {
                                            println!(
                                                "insert {} {} error(s): {}",
                                                DB_NAME, USER_COLLECTION, err
                                            );
                                            return Resp::err(500, "创建用户失败").to_json_result();
                                        }
                                    }
                                }
                                Err(err) => {
                                    println!(
                                        "Update {} {} error(s): {}",
                                        DB_NAME, VERIFICATION_COLLECTION, err
                                    );
                                    return Resp::err(500, "创建用户失败").to_json_result();
                                }
                            }
                        } else {
                            return Resp::err(500, "验证码已被使用").to_json_result();
                        }
                    } else {
                        return Resp::err(500, "验证码已过期").to_json_result();
                    }
                } else {
                    return Resp::err(500, "验证码错误").to_json_result();
                }
            }

            Err(err) => {
                println!(
                    "Get {} {} error(s): {}",
                    DB_NAME, VERIFICATION_COLLECTION, err
                );
                ::std::process::exit(1);
            }
        }
    }

    #[post("/login")]
    async fn login(data: web::Json<LoginData>) -> RespResult {
        Resp::ok({}).to_json_result()
    }
}
