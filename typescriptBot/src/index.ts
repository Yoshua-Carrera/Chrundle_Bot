import 'dotenv/config'
import { Client, Message } from 'discord.js'
import { ClientEvents, intentList } from './models/discord-constants.models'
import { createChannelCommand } from './commands/channel-management/channel-management'
 
let botId: string | undefined;

const client = new Client({
    intents: [...intentList]
})


client.on(ClientEvents.READY, async (c: Client<true>) => {
    console.log(`${c.user.username} is online.`)
    await c.application.fetch()
    botId = c.application.bot?.id
})

client.on(ClientEvents.MESSAGE_CREATE, async (msg: Message<boolean>) => {
    //TODO clean this code
    if(msg.author.id === botId) return

    if (msg.content === '.test') {
        await msg.channel.send('Hello world')
    }
    
    const arg = msg.content.split(' ')
    
    if (arg[0] === createChannelCommand.name) {
        createChannelCommand.callback(msg, {name: arg[1] })
    }
})

client.login(process.env.TOKEN)