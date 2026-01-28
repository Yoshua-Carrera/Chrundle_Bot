import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  Message,
} from "discord.js";

export interface CommandBody {
  name: string;
  description: string;
  callback: CommandCallback<CommandResult, any>;
  slashCallback: slashCommandCallback<CommandResult>;
  options?: CommandBodyOption[];
}

type CommandCallback<T, A> = (msg: Message<boolean>, args?: A) => Promise<T>;
type slashCommandCallback<T> = (
  interaction: ChatInputCommandInteraction,
) => Promise<T>;

export interface CommandResult {
  success: boolean;
  message: string;
  error?: string | null;
}

export interface CommandBodyOption {
  name: string;
  description: string;
  type: ApplicationCommandOptionType;
  required: boolean;
}

export enum SlashCommandOptions {
  CHANNEL = "channel",
  CHANNEL_ID = "channel-id",
  VOICE = "voice",
  TARGET = "target",
}

export enum AvatarOptions {
  USER_ID = "userid",
}

export enum EmoteOptions {
  URL = "url",
  NAME = "name",
}

export enum ServerCommandOptions {
  SERVER_ID = "server_id",
  CHANNEL_ID = "channel_id",
}

export enum SuccessFailure {
  SUCESS = "success",
  FAILURE = "failure",
}
