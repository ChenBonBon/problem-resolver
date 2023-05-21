pub mod common {
    use actix_web::{error, HttpResponse};
    use failure::Fail;
    use rand::Rng;
    use serde::{Deserialize, Serialize};

    #[derive(Fail, Debug)]
    pub enum BusinessError {
        #[fail(display = "Validation error on field: {}", field)]
        ValidationError { field: String },
        #[fail(display = "An internal error occurred. Please try again later.")]
        InternalError,
    }

    impl error::ResponseError for BusinessError {
        fn error_response(&self) -> HttpResponse {
            match *self {
                BusinessError::ValidationError { .. } => {
                    let resp = Resp::err(10001, &self.to_string());
                    HttpResponse::BadRequest().json(resp)
                }
                _ => {
                    let resp = Resp::err(10000, &self.to_string());
                    HttpResponse::InternalServerError().json(resp)
                }
            }
        }
    }

    #[derive(Deserialize, Serialize)]
    pub struct Resp<T>
    where
        T: Serialize,
    {
        code: i32,
        message: String,
        data: Option<T>,
    }

    impl<T: Serialize> Resp<T> {
        pub fn ok(data: T) -> Self {
            Resp {
                code: 0,
                message: "ok".to_owned(),
                data: Some(data),
            }
        }

        pub fn to_json_result(&self) -> Result<HttpResponse, BusinessError> {
            Ok(HttpResponse::Ok().json(self))
        }
    }

    impl Resp<()> {
        pub fn err(error: i32, message: &str) -> Self {
            Resp {
                code: error,
                message: message.to_owned(),
                data: None,
            }
        }
    }

    pub type RespResult = Result<HttpResponse, BusinessError>;

    pub fn generate_code(len: u8) -> String {
        let mut rng = rand::thread_rng();
        let mut code = "".to_string();

        for _i in 1..=len {
            code = format!("{}{}", code, rng.gen_range(0..10))
        }

        return code;
    }

    pub const DB_NAME: &str = "problem-resolver";
    pub const VERIFICATION_COLLECTION: &str = "verification";
    pub const USER_COLLECTION: &str = "user";
    pub const REGISTER_TEMPLATE: &str = "user/register.html";
}
