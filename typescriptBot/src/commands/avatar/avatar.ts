import { ApplicationCommandOptionType, ChatInputCommandInteraction } from "discord.js";
import { AvatarOptions, CommandBody, CommandResult } from "../../models/discord-custom-command.models";

export const avatarCommand: CommandBody = {
  name: "avatar",
  description: "Get avatar",
  callback: async () => {
    const returnValue: CommandResult = {
      success: true,
      message: "something",
      error: null,
    };
    return returnValue;
  },
  slashCallback: async (interaction: ChatInputCommandInteraction) => {
    const userId: string = interaction.options.get(AvatarOptions.USER_ID).value as string;
    if (userId) {
      // return the avatar of the uwser that was requested
      const user = await interaction.guild.members.fetch(userId)
      interaction.reply(user.user.avatarURL())
    } else {
      // return the avatar of the user THAT requested
      interaction.reply(interaction.user.avatarURL());
      const returnValue: CommandResult = {
        success: true,
        message: "something",
        error: null,
      };
      return returnValue;
    }
  },
  options: [
    {
      name: "userid",
      description: "Some user",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
};

export const avatarCommands: CommandBody[] = [avatarCommand];
