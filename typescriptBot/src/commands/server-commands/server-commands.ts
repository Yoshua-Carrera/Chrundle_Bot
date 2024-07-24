import {
  ApplicationCommandOptionType,
  ButtonInteraction,
  CacheType,
  ChatInputCommandInteraction,
  Collection,
  ComponentType,
  EmbedBuilder,
  GuildTextBasedChannel,
  Message,
  NonThreadGuildBasedChannel,
} from "discord.js";
import {
  CommandBody,
  ServerCommandOptions,
  SuccessFailure,
} from "../../models/discord-custom-command.models";
import {
  EmbedColor,
  EmbedDescription,
  EmbedFields,
  EmbedFieldValues,
  EmbedTitles,
  InteractionID,
} from "../../models/discord-embed.models";
import { FallBackMessaging } from "../../models/discord-message.models";
import { EmbedService } from "../../services/embed.service";

const embedService = new EmbedService()

export const listServers: CommandBody = {
  name: "list_servers",
  description: "List all servers bot is in",
  callback: async (msg: Message<boolean>) => {
    try {
      const embed: EmbedBuilder = new EmbedBuilder();
      embed
        .setColor(EmbedColor.BLURPLE)
        .setTitle(EmbedTitles.SERVER_LIST)
        .setDescription(EmbedDescription.SERVER_LIST);
      msg.client.guilds.cache.forEach((guild) => {
        embed
          .addFields(
            { name: EmbedFields.NAME, value: guild.name, inline: true },
            { name: EmbedFields.ID, value: guild.id, inline: true }
          )
          .addFields({
            name: EmbedFields.EMPTY,
            value: EmbedFields.EMPTY,
          });
      });
      msg.reply({ embeds: [embed] });
      return {
        success: true,
        message: SuccessFailure.SUCESS,
      };
    } catch (error) {
      msg.reply((error as Error)?.message || FallBackMessaging.GENERIC);
    }
  },
  slashCallback: async (interaction: ChatInputCommandInteraction) => {
    const embed: EmbedBuilder = new EmbedBuilder();
    embed
      .setColor(EmbedColor.BLURPLE)
      .setTitle(EmbedTitles.SERVER_LIST)
      .setDescription(EmbedDescription.SERVER_LIST);
    try {
      interaction.client.guilds.cache.forEach((guild) => {
        embed
          .addFields(
            { name: EmbedFields.NAME, value: guild.name, inline: true },
            { name: EmbedFields.ID, value: guild.id, inline: true }
          )
          .addFields({
            name: EmbedFields.EMPTY,
            value: EmbedFields.EMPTY,
          });
      });
      interaction.reply({ embeds: [embed] });
      return {
        success: true,
        message: SuccessFailure.SUCESS,
      };
    } catch (error) {
      interaction.reply((error as Error)?.message || FallBackMessaging.GENERIC);
    }
  },
};

export const retrieveServerChannels: CommandBody = {
  name: "retrieve_server_channels",
  description: "Retrieve channels of a specific server",
  callback: async (msg: Message<boolean>) => {
    msg.channel;
    try {
      msg.reply('currently not supported, please use slash commands')
      return {
        success: true,
        message: SuccessFailure.SUCESS,
      };
    } catch (error) {
      msg.reply((error as Error)?.message || FallBackMessaging.GENERIC);
    }
  },
  slashCallback: async (interaction: ChatInputCommandInteraction) => {
    let embedCounter: number = 0;
    let activeEmbed: number = 0;
    let buttons = embedService.navigationButtons()
    let components = embedService.buildActionRow()
    const maxPageSize: number = 8;
    const embedArray: EmbedBuilder[] = [];
    const serverId: string = interaction.options.get(
      ServerCommandOptions.SERVER_ID
    )?.value as string;
    const server = await interaction.client.guilds.fetch(serverId);
    const channels: Collection<string, NonThreadGuildBasedChannel> =
      await server.channels.fetch();
    try {
      channels.forEach((channel: NonThreadGuildBasedChannel) => {
        embedCounter++;
        // Pagination
        if (embedArray.length < Math.ceil(embedCounter / maxPageSize)) {
          // Need to add a new embed for pagination (max 5)
          embedArray.push(
            new EmbedBuilder()
              .setColor(EmbedColor.BLURPLE)
              .setTitle(EmbedTitles.SERVER_CHANNEL_LIST)
              .setDescription(EmbedDescription.SERVER_CHANNEL_LIST)
              .addFields(
                { name: EmbedFields.NAME, value: channel.name, inline: true },
                { name: EmbedFields.ID, value: channel.id, inline: true }
              )
              .addFields({
                name: EmbedFields.EMPTY,
                value: EmbedFields.EMPTY,
              })
          );
        } else {
          embedArray[Math.ceil(embedCounter / maxPageSize)-1]
            .addFields(
              { name: EmbedFields.NAME, value: channel.name, inline: true },
              { name: EmbedFields.ID, value: channel.id, inline: true }
            )
            .addFields({
              name: EmbedFields.EMPTY,
              value: EmbedFields.EMPTY,
            });
        }
      });
      // Row button event handling
      const message = await interaction.reply({embeds: [embedArray[activeEmbed]], components: [components as any], fetchReply: true});
      const collector = await message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60*10000
      })
      collector.on('collect', async (btnInteraction: ButtonInteraction<CacheType>) => {
        if(btnInteraction.user.id === interaction.user.id) {
          await btnInteraction.deferUpdate();
          switch(btnInteraction.customId) {
            case InteractionID.PAGE_FIRST:
              activeEmbed = 0;
              buttons.nextPageButton.setDisabled(false)
              break;
            case InteractionID.PAGE_PREVIOUS:
              if(activeEmbed > 0) {
                activeEmbed--
                buttons.nextPageButton.setDisabled(false)
                if(activeEmbed === 0) {
                  buttons.previousPageButton.setDisabled(true)
                }
              }
              break;
            case InteractionID.PAGE_NEXT:
              if(activeEmbed < embedArray.length-1) {
                activeEmbed++
                buttons.previousPageButton.setDisabled(false)
                if(activeEmbed === embedArray.length-1) {
                  buttons.nextPageButton.setDisabled(true)
                }
              }
              break;
            case InteractionID.PAGE_LAST:
              activeEmbed = embedArray.length-1
              buttons.previousPageButton.setDisabled(false)
              break;
          }
          await message.edit({embeds: [embedArray[activeEmbed]], components: [embedService.buildActionRow(buttons) as any]})
        } else {
          await btnInteraction.reply({
            content: `Only ${interaction.user.username} can interact with the buttons`,
            ephemeral: true
          })
        }
      })
      return {
        success: true,
        message: SuccessFailure.SUCESS,
      };
    } catch (error) {
      interaction.reply((error as Error)?.message || FallBackMessaging.GENERIC);
    }
  },
  options: [
    {
      name: "server_id",
      description: "The ID of the server you want to query",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
};

export const retrieveNMessages: CommandBody = {
  name: "retrieve_messages",
  description: "retrieve the last n messages from a server",
  callback: async (msg: Message<boolean>) => {
    try {
      msg.reply('currently not supported, please use slash commands')
      return {
        success: true,
        message: SuccessFailure.SUCESS,
      };
    } catch (error) {
      msg.reply((error as Error)?.message || FallBackMessaging.GENERIC);
    }
  },
  slashCallback: async (interaction: ChatInputCommandInteraction) => {
    let response: string;
    const serverId: string = interaction.options.get(
      ServerCommandOptions.SERVER_ID
    )?.value as string;
    const chanelId: string = interaction.options.get(
      ServerCommandOptions.CHANNEL_ID
    )?.value as string;
    const server = await interaction.client.guilds.fetch(serverId);
    const channel = await server.channels.fetch(chanelId);
    const fetchParams = { limit: 10 };
    const messages = await (channel as GuildTextBasedChannel).messages.fetch(
      fetchParams
    );
    messages.forEach((message: Message<true>) => {
      response = response +`${message.author.username}: ${message.content}\n`
    });
    console.log({response: response.length})
    try {
      interaction.reply(response)
      return {
        success: true,
        message: SuccessFailure.SUCESS,
      };
    } catch (error) {
      interaction.reply((error as Error)?.message || FallBackMessaging.GENERIC);
    }
  },
  options: [
    {
      name: "server_id",
      description: "The ID of the server you want to query",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "channel_id",
      description: "The name of the channel you want to query",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
};

export const listServersCommands: CommandBody[] = [
  listServers,
  retrieveServerChannels,
  retrieveNMessages,
];
