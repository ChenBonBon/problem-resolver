use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Eq, Deserialize, Serialize)]
pub struct User {
    pub email: String,
    pub user_name: String,
    pub password_md5: String,
    pub logined: bool,
    pub create_at: String,
    pub update_at: String,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub phone: Option<String>,
    pub birthday: Option<String>,
    pub last_login_at: Option<String>,
    pub last_login_ip: Option<String>,
}

#[derive(Deserialize)]
pub struct Register {
    pub email: String,
    pub password: String,
}

#[derive(Deserialize)]
pub struct Login {
    pub email: String,
    pub password: String,
}
