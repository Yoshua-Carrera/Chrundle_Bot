import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, Message } from "discord.js"

export interface CommandBody {
    name: string,
    description: string,
    callback: CommandCallback<CommandResult, any>,
    slashCallback: slashCommandCallback<CommandResult, any>,
    options?: CommandBodyOption[],

}

type CommandCallback<T, A> = (msg: Message<boolean>, args?: A) => Promise<T>
type slashCommandCallback<T, A> = (interaction: ChatInputCommandInteraction) => Promise<T>

export interface CommandResult {
    success: boolean;
    message: string
    error: string | null;
}

export interface CommandBodyOption {
    name: string,
    description: string,
    type: ApplicationCommandOptionType,
    required: boolean
} 

export enum  SlashCommandOptions {
    CHANNEL='channel',
    CHANNEL_ID='channel-id',
    VOICE='voice',
    TARGET='target'
}