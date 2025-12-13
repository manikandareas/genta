package clerk

import (
	"github.com/clerk/clerk-sdk-go/v2"
	"github.com/clerk/clerk-sdk-go/v2/user"
	"github.com/manikandareas/genta/internal/server"
)

type Clerk struct {
	User *user.Client
}

func NewClerk(server *server.Server) (*Clerk, error) {
	clerkConfig := server.Config.Auth

	config := &clerk.ClientConfig{}
	config.Key = clerk.String(clerkConfig.SecretKey)

	return &Clerk{
		User: user.NewClient(config),
	}, nil
}
