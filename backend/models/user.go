package models

type LoginWithPassword struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginWithCode struct {
	Email string `json:"email"`
	Code  string `json:"code"`
}

type User struct {
	ID       string `json:"id"`
	Username string `json:"username"`
}

type UserCode struct {
	ID        string `json:"id"`
	Email     string `json:"email"`
	Code      string `json:"code"`
	CreatedAt string `json:"created_at"`
	ExpiresAt string `json:"expires_at"`
	Used      bool   `json:"used"`
}
