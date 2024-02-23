import { CategoryCreateChannelOptions, Message } from "discord.js";
import { ChannelManagementCommand } from "../../models/discord-custom-command.models";
import { error } from "console";

export const createChannelCommand: ChannelManagementCommand = {
    name: 'add_channel',
    description: 'Adds a brand new channel under a specific category',
    callback: async (msg: Message<boolean>, createChannelPayload: CategoryCreateChannelOptions) => {
        try {
            await msg.guild?.channels.create(createChannelPayload)
        } catch (error) {
            await msg.channel.send(`Something went wrong: ${error}` )
        }
    }
}