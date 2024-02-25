import { CategoryCreateChannelOptions, ChannelType, Message } from "discord.js";
import { ChannelManagementCommand } from "../../models/discord-custom-command.models";
import { ChrundleDtoService } from "../../services/chrundle-dto.service";

const chrundleDtoService = new ChrundleDtoService()

export const createChannelCmd: ChannelManagementCommand = {
    name: 'create_channel',
    description: 'Adds a brand new channel under a specific category',
    callback: async (msg: Message<boolean>) => {
        try {
            
            const arg = msg.content.split(" ");
            const regex: RegExp = /-([0-9]{18,})/g
            const channelCreateOptions: CategoryCreateChannelOptions = {
                name: arg[1],
                type: !!msg.content.includes('-v') ? ChannelType.GuildVoice : ChannelType.GuildText
            }

            const channel = await msg.guild?.channels.create(channelCreateOptions)
            const targetCategory: string | undefined = msg.content.match(regex)?.[0]
            console.log({
                channelCreateOptions,
                msg: msg.content,
                vflag: !!msg.content.indexOf('-v'),
                reg: msg.content.match(regex)
            })
            if(targetCategory)
            channel?.setParent(targetCategory.replace('-', ''))

        } catch (error) {
            await msg.channel.send(`Something went wrong: ${error}` )
        }
    }
}

export const deleteChannelCmd: ChannelManagementCommand = {
    name: 'delete_channel',
    description: 'deletes a channel by ID',
    callback: async (msg: Message<boolean>) => {
        try {
            const arg = msg.content.split(" ");
            await msg.guild?.channels.delete(arg[1])
        } catch (error) {
            await msg.channel.send(`Something went wrong: ${error}` )
        }
    }
}

export const channelManagementCommand: ChannelManagementCommand[] = [createChannelCmd, deleteChannelCmd]