import { CategoryCreateChannelOptions, Message } from "discord.js"

export interface ChannelManagementCommand {
    name: string,
    description: string,
    callback: createChannelCallback<void, CategoryCreateChannelOptions>
}

type createChannelCallback<T, A> = (msg: Message<boolean>, args: A) => Promise<T> 