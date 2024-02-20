import 'dotenv/config'
import { Client, Message } from 'discord.js'
import { ClientEvents, intentList } from './models/discord-constants.model'
 
const client = new Client({
    intents: [...intentList]
})


client.on(ClientEvents.READY, (c: Client<true>) => {
    console.log(`${c.user.username} is online.`)
})

client.on(ClientEvents.MESSAGE_CREATE, async (msg: Message<boolean>) => {
    if (msg.content === '.test') {
        await msg.channel.send('Hello world')
    }
})

client.login(process.env.TOKEN)