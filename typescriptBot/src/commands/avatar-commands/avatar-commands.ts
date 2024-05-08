import { ApplicationCommandOptionType, ChatInputCommandInteraction, Message } from "discord.js";
import { AvatarOptions, CommandBody, CommandResult, SuccessFailure } from "../../models/discord-custom-command.models";

export const avatarCommand: CommandBody = {
  name: "avatar",
  description: "Get avatar",
  callback: async (msg: Message<boolean>) => {
    try {
      // From Mention
      const avatarFromMention: string =  msg.mentions?.users?.first()?.avatarURL()
      if (avatarFromMention) {
        msg.reply(avatarFromMention)
        return {
          success: true,
          message: SuccessFailure.SUCESS
        }    
      }
      // From ID
      const userId: string = msg.content.split(' ')?.[1]
      if(userId) {
        const user = await msg.guild.members.fetch(userId)
        msg.reply(user.user.avatarURL())
      } else {
        msg.reply(msg.author.avatarURL())
      }
      return {
        success: true,
        message: SuccessFailure.SUCESS
      }        
    } catch (error) {
      return {
        success: false,
        message: error as string
      }
    }
  },
  slashCallback: async (interaction: ChatInputCommandInteraction) => {
    try {
      const userId: string = interaction.options.get(AvatarOptions.USER_ID)?.value as string;
      if (userId) {
        const user = await interaction.guild.members.fetch(userId)
        interaction.reply(user.user.avatarURL())
      } else {
        interaction.reply(interaction.user.avatarURL());
        return {
          success: true,
          message: SuccessFailure.SUCESS,
        };
      }  
    } catch (error) {
      interaction.reply(error)
      return {
        success: false,
        message: error as string,
      };
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
