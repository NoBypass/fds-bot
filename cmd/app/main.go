package main

import (
	"github.com/fatih/color"
	"github.com/nobypass/fds-bot/internal/bot/event"
	"github.com/nobypass/fds-bot/internal/bot/interaction"
	"github.com/nobypass/fds-bot/internal/bot/session"
	"github.com/nobypass/fds-bot/internal/pkg/version"
	"os"
	"os/signal"
)

func init() {
	println(`
   _______  ____   ___       __
  / __/ _ \/ __/  / _ )___  / /_
 / _// // /\ \   / _  / _ \/ __/
/_/ /____/___/  /____/\___/\__/   ` + color.New(color.FgMagenta).Sprint(version.VERSION) + `
The FDS Discord bot written in    ` + color.New(color.BgHiCyan).Add(color.FgHiWhite).Sprint(" GO ") + `
________________________________________________
`)
}

func main() {
	s := session.ConnectToDiscord()
	fds := session.ConnectToFDS()
	em := event.NewManager(s)
	defer s.Close()

	cmds := interaction.AllCommands(fds)

	em.Add(cmds...)

	s.AddHandler(em.Handle)

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt)
	<-stop
}
