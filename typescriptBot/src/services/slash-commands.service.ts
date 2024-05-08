import { REST, Routes } from "discord.js"
import { channelManagementCommand } from "../commands/channel-management/channel-management"
import { avatarCommands } from "../commands/avatar-commands/avatar-commands"
import { emoteCommands } from "../commands/emote-commands/emote-commands"

export class SlashCommandsService {
  discordRest = new REST().setToken(process.env.TOKEN as string)

  constructor() { }

  async registerCommands() {
    try {
      console.log('Registering commands...')
      await this.discordRest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID as string,
          process.env.GUILD_ID as string,
        ),
        { body: this.loadCommands() }
      )
      console.log('Slash commands registered')
    } catch (error) {
      console.log(`Something went wrong, Error: ${error}`)
    }
  }

  async registerGlobalCommands() {
    try {
      console.log('Registering Global commands...')
      await this.discordRest.put(
        Routes.applicationCommands(
          process.env.CLIENT_ID as string,
        ),
        { body: this.loadCommands() }
      )
      console.log('Slash global commands registered')
    } catch (error) {
      console.log(`Something went wrong, Error: ${error}`)
    }
  }

  loadCommands() {
    return [
      ...channelManagementCommand,
      ...avatarCommands,
      ...emoteCommands
    ]
  }
}
