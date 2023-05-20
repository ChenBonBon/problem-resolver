use std::net::Ipv4Addr;

use mongodb::bson::DateTime;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Eq, Deserialize, Serialize)]
pub struct User {
    pub first_name: String,
    pub last_name: String,
    pub username: String,
    pub password: String,
    pub email: String,
    pub last_login_ip: Ipv4Addr,
    pub last_login_at: DateTime,
    pub created_at: DateTime,
}

#[derive(Clone, Debug, PartialEq, Eq, Deserialize, Serialize)]
pub struct Verication {
    pub code: String,
    pub email: String,
    pub created_at: DateTime,
    pub expired_at: DateTime,
    pub verified: bool,
}
