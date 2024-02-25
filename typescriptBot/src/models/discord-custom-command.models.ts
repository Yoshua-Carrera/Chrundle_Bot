import { Message } from "discord.js"

export interface ChannelManagementCommand {
    name: string,
    description: string,
    callback: channelManagementCallback<void, any>
}

type channelManagementCallback<T, A> = (msg: Message<boolean>, args?: A) => Promise<T>