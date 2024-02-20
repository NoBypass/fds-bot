package commands

import (
	"github.com/bwmarrin/discordgo"
	"github.com/nobypass/fds-bot/internal/bot/components"
	"github.com/nobypass/fds-bot/internal/pkg/utils"
	"math/rand"
	"strings"
)

var two = 2.0

type Teams struct {
}

func (t *Teams) Run(s *discordgo.Session, i *discordgo.InteractionCreate) error {
	options := i.ApplicationCommandData().Options
	playersStr := utils.Find(options, func(o *discordgo.ApplicationCommandInteractionDataOption) bool {
		return o.Name == "players"
	}).StringValue()
	teamsInput := utils.Find(options, func(o *discordgo.ApplicationCommandInteractionDataOption) bool {
		return o.Name == "teams"
	})
	membersInput := utils.Find(options, func(o *discordgo.ApplicationCommandInteractionDataOption) bool {
		return o.Name == "members"
	})
	players := strings.Split(playersStr, " ")
	playerAmount := len(players)

	var teamAmount int64
	memberAmount := int64(2)
	if teamsInput != nil {
		teamAmount = teamsInput.IntValue()
	}
	if membersInput != nil {
		memberAmount = membersInput.IntValue()
	}

	var teams [][]string
	if memberAmount != 0 {
		teams = make([][]string, playerAmount/int(memberAmount))
	} else {
		teams = make([][]string, int(teamAmount))
	}

	rand.Shuffle(len(players), func(i, j int) {
		players[i], players[j] = players[j], players[i]
	})
	for i, player := range players {
		teams[i%len(teams)] = append(teams[i%len(teams)], player)
	}

	return s.InteractionRespond(i.Interaction, &discordgo.InteractionResponse{
		Type: discordgo.InteractionResponseChannelMessageWithSource,
		Data: &discordgo.InteractionResponseData{
			Embeds: []*discordgo.MessageEmbed{
				components.EmbedTeams(teams),
			},
		},
	},
	)
}

func (t *Teams) Content() *discordgo.ApplicationCommand {
	return &discordgo.ApplicationCommand{
		Name:        "teams",
		Description: "Generate random teams from input",
		Version:     "v1.0.3",
		Options: []*discordgo.ApplicationCommandOption{
			{
				Name:        "players",
				Description: "List of players seperated by a space",
				Type:        discordgo.ApplicationCommandOptionString,
				Required:    true,
			},
			{
				Name:        "teams",
				Description: "Number of teams (default: 2)",
				Type:        discordgo.ApplicationCommandOptionInteger,
				MinValue:    &two,
				Required:    false,
			},
			{
				Name:        "members",
				Description: "Number of members per team (takes priority over teams amount)",
				Type:        discordgo.ApplicationCommandOptionInteger,
				MinValue:    &two,
				Required:    false,
			},
		},
	}
}