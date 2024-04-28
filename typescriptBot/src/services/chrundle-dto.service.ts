import { ChatInputCommandInteraction, Message } from "discord.js";
import { CommandBody } from "../models/discord-custom-command.models";

export class ChrundleDtoService {
  public prefix: string = ".";

  isCommandMatch(msg: Message<boolean>, channelManagementCommand: CommandBody[]) {
    const arg = msg.content.split(" ");
    const commandMatch: CommandBody | undefined = channelManagementCommand.find((command: CommandBody) => {
      return arg[0] === `${this.prefix}${command.name}`;
    });
    return commandMatch;
  }

  isSlashCommandMatch(interaction: ChatInputCommandInteraction, commands: CommandBody[]) {
    const name = interaction.commandName;
    const commandMatch: CommandBody | undefined = commands.find((command: CommandBody) => (command.name === name));
    return commandMatch;
  }
}