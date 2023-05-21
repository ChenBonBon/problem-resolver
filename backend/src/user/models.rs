use std::net::Ipv4Addr;

use mongodb::bson::DateTime;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Eq, Deserialize, Serialize)]
pub struct User {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub username: Option<String>,
    pub password: String,
    pub email: String,
    pub last_login_ip: Option<Ipv4Addr>,
    pub last_login_at: Option<DateTime>,
    pub created_at: DateTime,
}

#[derive(Clone, Debug, PartialEq, Eq, Deserialize, Serialize)]
pub struct Verification {
    pub code: String,
    pub email: String,
    pub created_at: DateTime,
    pub expired_at: DateTime,
    pub verified: bool,
}
