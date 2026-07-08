// TODO: Add embed logic
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  DiscordErrorData,
  Message,
  OAuthErrorData,
} from "discord.js";
import {
  CommandBody,
  CommandResult,
  SuccessFailure,
} from "../../models/discord-custom-command.models";
import { extractApiError } from "../../services/error-handling.service";
import { GetMangaByNameQuery } from "../../gql/graphql";
import { executeQuery } from "../../services/graphql.service";

export const getMangaCommand: CommandBody = {
  name: "manga",
  description: "Get manga",
  callback: async (msg: Message<boolean>) => {
    try {
      var query = `
      query ($search: String) {
        Media (type: ANIME, search: $search) {
          id
          title {
            romaji
            english
            native
          }
        }
      }
      `;

      var variables = {
        search: msg.content.split(" ")?.slice(1)?.join(" "),
      };

      const options: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: query,
          variables: variables,
        }),
      };

      const responseData = await executeQuery<GetMangaByNameQuery>({ options });

      msg.reply(JSON.stringify(responseData));
      return {
        success: true,
        message: JSON.stringify(responseData ?? "No response"),
      };
    } catch (error) {
      msg.reply(error);
      return {
        success: false,
        message: SuccessFailure.FAILURE,
        error: error as string,
      };
    }
  },
  slashCallback: async (interaction: ChatInputCommandInteraction) => {
    try {
      var query = `
      query ($search: String) {
        Media (type: ANIME, search: $search) {
          id
          title {
            romaji
            english
            native
          }
        }
      }
      `;

      var variables = {
        search: interaction.options.get("manga").value,
      };

      const options: RequestInit = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: query,
          variables: variables,
        }),
      };

      const responseData = await executeQuery<GetMangaByNameQuery>({ options });
      interaction.reply(JSON.stringify(responseData));
      return {
        success: true,
        message: JSON.stringify(responseData ?? "No response"),
      };
    } catch (error: unknown) {
      interaction.reply(
        `Something went wrong: ${extractApiError(error as DiscordErrorData | OAuthErrorData)}`,
      );
      return {
        success: false,
        message: `Something went wrong: ${extractApiError(error as DiscordErrorData | OAuthErrorData)}`,
        error,
      } as CommandResult;
    }
  },
  options: [
    {
      name: "manga",
      description: "Some Manga Title",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

export const mangaCommands: CommandBody[] = [getMangaCommand];
