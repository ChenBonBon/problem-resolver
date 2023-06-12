pub mod utils {
    use regex::Regex;

    pub fn is_email(email: &str) -> bool {
        let re = Regex::new(r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$").unwrap();

        re.is_match(email)
    }

    pub fn get_email_name(email: &str) -> Option<String> {
        let re = Regex::new(r"^([A-Za-z0-9._%+-]+)@").unwrap();
        if let Some(caps) = re.captures(email) {
            if let Some(name) = caps.get(1) {
                Some(name.as_str().to_string())
            } else {
                None
            }
        } else {
            None
        }
    }
}
