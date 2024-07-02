import { ApplicationCommandOptionType, ChatInputCommandInteraction, GuildEmoji, Message } from "discord.js";
import { CommandBody, EmoteOptions, SuccessFailure } from "../../models/discord-custom-command.models";
import { FallBackMessaging } from "../../models/discord-message.models";

export const addEmote: CommandBody = {
  name: "add_emote",
  description: "Add a brand new emote",
  callback: async (msg: Message<boolean>) => {
    try {
      const url: string = msg.content.split(' ')?.[1];
      const name: string = msg.content.split(' ')?.[2];
      const newEmote: GuildEmoji = await msg.guild.emojis.create({ attachment: url, name })
      msg.reply(`:${name}: emote has been added ${newEmote}`)
      return {
        success: true,
        message: SuccessFailure.SUCESS
      }
    } catch (error) {
      msg.reply((error as Error)?.message || FallBackMessaging.GENERIC)
      return {
        success: false,
        message: SuccessFailure.FAILURE,
        error: error as string
      }
    }
  },
  slashCallback: async (interaction: ChatInputCommandInteraction) => {
    try {
      const url: string = interaction.options.get(EmoteOptions.URL)?.value as string;
      const name: string = interaction.options.get(EmoteOptions.NAME)?.value as string;
      const newEmote: GuildEmoji = await interaction.guild.emojis.create({ attachment: url, name })
      interaction.reply(`:${name}: emote has been added ${newEmote}`)
      return {
        success: true,
        message: SuccessFailure.SUCESS
      }
    } catch (error) {
      interaction.reply((error as Error)?.message || FallBackMessaging.GENERIC)
      return {
        success: false,
        message: SuccessFailure.FAILURE,
        error: error as string
      }
    }
  },
  options: [
    {
      name: "url",
      description: "The image url of the emote",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "name",
      description: "The name of the emote",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

export const emoteCommands: CommandBody[] = [addEmote];
