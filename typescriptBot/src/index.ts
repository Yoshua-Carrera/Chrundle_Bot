import "dotenv/config";
import * as yargs from 'yargs'
import { CacheType, Client, Interaction, Message } from "discord.js";
import { ClientEvents, intentList } from "./models/discord-constants.models";
import { ChrundleDtoService } from "./services/chrundle-dto.service";
import { SlashCommandsService } from './services/slash-commands.service'

class ChrundleBot {
  botId: string | undefined;

  client = new Client({
    intents: [...intentList],
  });
  constructor(
    private chrundleDtoService: ChrundleDtoService,
    private slashCommandsService: SlashCommandsService
  ) {
    this.initializeBot();
  }

  initializeBot(): void {
    const options = this.unpackYargs().argv as { globalCommands: boolean, privateCommands: boolean }
    // Client on ready listener
    this.client.on(ClientEvents.READY, async (client: Client<true>) => {
      console.log(`${client.user.username} is online.`);
      await client.application.fetch();
      this.botId = client.application.bot?.id;
    });
    console.log({
      globalCommands: options.globalCommands,
      privateCommands: options.privateCommands,
    })
    // Register slash commands
    options.globalCommands ? 
      this.slashCommandsService.registerGlobalCommands() :
      this.slashCommandsService.registerCommands()

    // Client message creation listener
    this.client.on(
      ClientEvents.MESSAGE_CREATE,
      async (msg: Message<boolean>) => {
        // TODO clean this code
        if (msg.author.id === this.botId) return;
        if(options.privateCommands && msg.author.id !== process.env.PRIVATE) return;

        if (msg.content === `${this.chrundleDtoService.prefix}test`) {
          await msg.channel.send("Hello world");
        }

        const commandMatch = this.chrundleDtoService.isCommandMatch(msg, this.slashCommandsService.loadCommands());

        if (!!commandMatch) {
          commandMatch.callback(msg);
        }
      }
    );

    this.client.on(ClientEvents.INTERACTION_CREATE, (interaction: Interaction<CacheType>) => {
      if (!interaction.isChatInputCommand()) return;
      if(options.privateCommands && interaction.user.id !== process.env.PRIVATE) return;
      const slashCommandMatch = this.chrundleDtoService.isSlashCommandMatch(interaction, this.slashCommandsService.loadCommands())
      if(!!slashCommandMatch) {
        slashCommandMatch.slashCallback(interaction)
      }
    })
  }
  
  unpackYargs() {
    return yargs
      .usage('Usage: -g <globalCommands>')
      .help('help')
      .option('globalCommands', {
        alias: 'g',
        describe: 'Should the slash commands be posted at a global level',
        type: 'boolean',
        default: false
      })
      .usage('Private: -p <privateCommands>')
      .option('privateCommands', {
        alias: 'p',
        describe: 'Privately run commands',
        type: 'boolean',
        default: false
      })
  }
}

const chrundleBot = new ChrundleBot(new ChrundleDtoService(), new SlashCommandsService());
chrundleBot.client.login(process.env.TOKEN);
