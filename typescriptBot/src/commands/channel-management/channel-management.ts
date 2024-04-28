import { ApplicationCommandOptionType, CategoryCreateChannelOptions, ChannelType, ChatInputCommandInteraction, Message } from "discord.js";
import { CommandBody, CommandResult, SlashCommandOptions } from "../../models/discord-custom-command.models";

export const createChannelCmd: CommandBody = {
  name: "create_channel",
  description: "Adds a brand new channel under a specific category",
  callback: async (msg: Message<boolean>) => {
    try {
      const arg = msg.content.split(" ");
      const regex: RegExp = /-([0-9]{18,})/g;
      const channelCreateOptions: CategoryCreateChannelOptions = {
        name: arg[1],
        type: !!msg.content.includes("-v") ? ChannelType.GuildVoice : ChannelType.GuildText,
      };

      const channel = await msg.guild?.channels.create(channelCreateOptions);
      const targetCategory: string | undefined = msg.content.match(regex)?.[0];
      if (targetCategory) {
        channel?.setParent(targetCategory.replace("-", ""));
      }
      return {
        success: true,
        message: `Channel "${arg[1]}" created`,
        error: null,
      } as CommandResult;
    } catch (error) {
      await msg.channel.send(`Something went wrong: ${error}`);
      return {
        success: false,
        message: `Something went wrong, error: ${error}`,
        error,
      } as CommandResult;
    }
  },
  slashCallback: async (interaction: ChatInputCommandInteraction) => {
    try {
      const channelCreateOptions: CategoryCreateChannelOptions = {
        name: interaction.options.get(SlashCommandOptions.CHANNEL).value as string,
        type: interaction.options.get(SlashCommandOptions.VOICE)?.value ? ChannelType.GuildVoice : ChannelType.GuildText,
      };
      const channel = await interaction.guild?.channels.create(channelCreateOptions);
      const targetCategory: string = interaction.options.get(SlashCommandOptions.TARGET)?.value as string;
      if (targetCategory) {
        channel?.setParent(targetCategory);
      }
      const message: string = `Channel "${interaction.options.get(SlashCommandOptions.CHANNEL).value}" created`;
      interaction.reply(message);

      return { success: true, message: message, error: null } as CommandResult;
    } catch (error) {
      interaction.reply(`Something went wrong: ${error}`);
      return {
        success: false,
        message: `Something went wrong, error: ${error}`,
        error,
      } as CommandResult;
    }
  },
  options: [
    {
      name: SlashCommandOptions.CHANNEL,
      description: "This is the new channel name",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: SlashCommandOptions.VOICE,
      description: "Is this a voice channel?",
      type: ApplicationCommandOptionType.Boolean,
      required: false,
    },
    {
      name: SlashCommandOptions.TARGET,
      description: "Target category to put the new channel in",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
};

export const deleteChannelCmd: CommandBody = {
  name: "delete_channel",
  description: "deletes a channel by ID",
  callback: async (msg: Message<boolean>) => {
    try {
      const arg = msg.content.split(" ");
      await msg.guild?.channels.delete(arg[1]);
      return {
        success: true,
        message: `Channel "${arg[1]}" created`,
      } as CommandResult;
    } catch (error) {
      await msg.channel.send(`Something went wrong,error: ${error}`);
      return {
        success: false,
        message: `Something went wrong, error: ${error}`,
        error,
      } as CommandResult;
    }
  },
  slashCallback: async (interaction) => {
    try {
      const targetId = interaction.options.get(SlashCommandOptions.CHANNEL_ID)?.value as string;
      const channel = await interaction.guild?.channels.fetch(targetId);
      interaction.guild?.channels.delete(targetId);
      interaction.reply(`Channel ${channel.name} deleted`);

      return {
        success: true,
        message: `Channel "${channel?.name}" created`,
        error: null,
      } as CommandResult;
    } catch (error) {
      return {
        success: false,
        message: `Something went wrong, error: ${error}`,
        error,
      } as CommandResult;
    }
  },
  options: [
    {
      name: SlashCommandOptions.CHANNEL_ID,
      description: "This is the ID of the channel to be deleted",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

export const channelManagementCommand: CommandBody[] = [createChannelCmd, deleteChannelCmd];
