import { Client, Collection, GatewayIntentBits } from 'discord.js'
import { Button, SlashCommand } from './types/discord'
import { config } from 'dotenv'
import { readdirSync } from 'fs'
import { join } from 'path'
import { log } from 'console'
import black from 'chalk'
import bgBlue from 'chalk'
import { JwtResponse } from './types/api'
import { login } from './lib/api'

const { Guilds, MessageContent, GuildMessages, GuildMembers } =
  GatewayIntentBits
export const client = new Client({
  intents: [Guilds, MessageContent, GuildMessages, GuildMembers],
})
config()

log(bgBlue(black('\n FDS Bot v2 is starting ')))
client.slashCommands = new Collection<string, SlashCommand>()
client.cooldowns = new Collection<string, number>()
client.buttons = new Collection<string, Button>()
client.auth = await login('FDS-Bot', process.env.TOKEN)

const handlersDir = join(__dirname, './src/handlers')
readdirSync(handlersDir).forEach((handler) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require(`${handlersDir}/${handler}`)(client)
})

export const auth: JwtResponse = await login('FDS-Bot', process.env.TOKEN)
client.login(process.env.TOKEN)
