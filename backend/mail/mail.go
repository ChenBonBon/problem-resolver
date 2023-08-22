package mail

import (
	"log/slog"
	"net/smtp"
	"os"

	"github.com/jordan-wright/email"
)

func SendMail(to string, subject string, html string) {
	senderName := os.Getenv("EMAIL_SENDER_NAME")
	senderAddress := os.Getenv("EMAIL_SENDER_ADDRESS")
	senderServer := os.Getenv("EMAIL_SENDER_SERVER")
	senderPort := os.Getenv("EMAIL_SENDER_PORT")
	senderPass := os.Getenv("EMAIL_SENDER_PASS")

    e := email.NewEmail()
    e.From = senderName + "<" + senderAddress + ">"
    e.To = []string{to}
    e.Subject = subject
    e.HTML = []byte(html)

    err := e.Send(senderServer + ":" + senderPort, smtp.PlainAuth("", senderAddress, senderPass, senderServer))

    if err != nil {
        slog.Error(err.Error())
		panic(err)
    }
}