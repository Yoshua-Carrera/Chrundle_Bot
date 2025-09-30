import { DiscordAPIError, DiscordErrorData, OAuthErrorData } from "discord.js";

export const extractApiError = (
  error: DiscordErrorData | OAuthErrorData,
): string => {
  const { rawError } = <DiscordAPIError>error;
  const message =
    (rawError as DiscordErrorData)?.message ??
    (rawError as OAuthErrorData)?.error_description;

  return message ?? JSON.stringify(error);
};
