import { Message } from "discord.js";
import { ChannelManagementCommand } from "../models/discord-custom-command.models";

export class ChrundleDtoService {
  public prefix: string = ".";

  isCommandMatch(msg: Message<boolean>, channelManagementCommand: ChannelManagementCommand[]) {
    const arg = msg.content.split(" ");
    const commandMatch: ChannelManagementCommand | undefined =
      channelManagementCommand.find(
        (command: ChannelManagementCommand) => {
          return arg[0] === `${this.prefix}${command.name}`
        }
          
      );
    return commandMatch;
  }
}