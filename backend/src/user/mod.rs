mod model;

pub mod user {
    use crate::{
        user::model::{Register, User},
        utils::utils::get_email_name,
        Global, Success,
    };
    use actix_web::{get, post, web, HttpResponse};
    use chrono::Utc;
    use mongodb::{bson::doc, Client, Collection};

    #[get("/{id}")]
    async fn get_user(
        client: web::Data<Client>,
        global: web::Data<Global>,
        user_id: web::Path<String>,
    ) -> HttpResponse {
        let user_id = user_id.into_inner();
        let collection: Collection<User> = client
            .database(&global.db_name)
            .collection(&global.user_collection_name);

        match collection.find_one(doc! { "_id": &user_id }, None).await {
            Ok(Some(user)) => HttpResponse::Ok().json(user),
            Ok(None) => HttpResponse::NotFound().body(format!("No user found with id {user_id}")),
            Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
        }
    }

    #[post("")]
    async fn add_user(
        client: web::Data<Client>,
        global: web::Data<Global>,
        register_data: web::Json<Register>,
    ) -> HttpResponse {
        let collection: Collection<User> = client
            .database(&global.db_name)
            .collection(&global.user_collection_name);
        let email = &register_data.email;
        let password = &register_data.password;
        let timestamp = Utc::now().timestamp();
        let data = User {
            email: email.clone(),
            user_name: get_email_name(&email).unwrap(),
            password_md5: format!("{:?}", md5::compute(password.clone())),
            logined: false,
            create_at: timestamp.to_string(),
            update_at: timestamp.to_string(),
            first_name: None,
            last_login_at: None,
            last_name: None,
            last_login_ip: None,
            birthday: None,
            phone: None,
        };
        let result = collection.insert_one(data, None).await;
        match result {
            Ok(_) => HttpResponse::Ok().json(Success {
                code: 0,
                message: "Add user success".to_string()
            }),
            Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
        }
    }

    pub fn config(cfg: &mut web::ServiceConfig) {
        cfg.service(web::scope("users").service(get_user).service(add_user));
    }
}
