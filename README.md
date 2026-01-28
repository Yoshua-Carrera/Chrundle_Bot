# Chrundle Bot 🤖

Welcome to the Chrundle Bot repository! This project features two Discord bots, one written in TypeScript and the other in Python, both designed to interact with the Discord API.

## 🚀 Project Structure

Here is a visual representation of the project's structure:

```
/home/algorithmic/code/chrundle_Bot/
├───.gitignore
├───package-lock.json
├───package.json
├───README.md
├───🐍 pythonBot/
│   ├───initializeToken/
│   │   ├───__init__.py
│   │   └───initializeToken.py
│   └───main/
│       └───main.py
└───🔷 typescriptBot/
    ├───package.json
    ├───tsconfig.json
    └───src/
        ├───index.ts
        ├───commands/
        │   ├───avatar-commands/
        │   │   └───avatar-commands.ts
        │   ├───channel-management/
        │   │   └───channel-management.ts
        │   ├───emote-commands/
        │   │   └───emote-commands.ts
        │   └───server-commands/
        │       └───server-commands.ts
        ├───models/
        │   ├───discord-constants.models.ts
        │   ├───discord-custom-command.models.ts
        │   ├───discord-embed.models.ts
        │   └───discord-message.models.ts
        └───services/
            ├───chrundle-dto.service.ts
            ├───embed.service.ts
            ├───error-handling.service.ts
            └───slash-commands.service.ts
```

## 🔷 TypeScript Bot

The TypeScript bot is the more feature-rich of the two and is built using the powerful [discord.js](https://discord.js.org/) library.

### Modus Operandi

The bot is designed to handle both traditional prefix-based commands and modern slash commands. This is achieved through a unified command structure. Each command object, defined by the `CommandBody` interface, contains two main execution properties:

- `callback`: This function is executed when the command is triggered by a message with the bot's prefix (e.g., `!avatar`).
- `slashCallback`: This function is executed when the command is triggered as a slash command (e.g., `/avatar`).

This dual-callback approach allows for flexible command invocation and ensures that all commands are accessible in both ways.

### GraphQL Integration

This project uses GraphQL to fetch data from external APIs, specifically the [Anilist API](https://graphql.anilist.co) for the manga commands. To ensure type safety and a better developer experience, we use [GraphQL Code Generator](https://www.graphql-code-generator.com/) to automatically generate TypeScript types from our `.gql` files.

When you run `npm run gen-gql`, it will:
1.  Look for `.gql` files in the `src/graphql` directory.
2.  Generate a corresponding `.ts` file for each `.gql` file. This generated file will contain typed document nodes that you can import directly into your command files.

This means you get full type support for your query variables and results, reducing the risk of runtime errors.

### Adding a New Command

To add a new command to the TypeScript bot, follow these steps:

1.  **Create a Command File**: In the `typescriptBot/src/commands` directory, create a new file for your command (e.g., `my-command.ts`). It's best to group related commands in a directory.

2.  **Define the Command**: In the new file, define your command object using the `CommandBody` interface. Here is a template:

    ```typescript
    import {
      ApplicationCommandOptionType,
      ChatInputCommandInteraction,
      Message,
    } from "discord.js";
    import {
      CommandBody,
      CommandResult,
      SuccessFailure,
    } from "../../models/discord-custom-command.models";

    export const myNewCommand: CommandBody = {
      name: "mycommand",
      description: "This is my new command",
      callback: async (msg: Message, args: string[]) => {
        // Logic for prefix command execution
        await msg.reply("Hello from a prefix command!");
        return { success: true, message: SuccessFailure.SUCESS };
      },
      slashCallback: async (interaction: ChatInputCommandInteraction) => {
        // Logic for slash command execution
        await interaction.reply("Hello from a slash command!");
        return { success: true, message: SuccessFailure.SUCESS };
      },
      options: [
        // Optional: Define slash command options here
        {
          name: "option1",
          description: "A description for your option",
          type: ApplicationCommandOptionType.String,
          required: true,
        },
      ],
    };

    export const myNewCommands: CommandBody[] = [myNewCommand];
    ```
    **Note on GraphQL Commands**: If your command uses GraphQL, first add your `.gql` file in the `src/graphql` directory, then run `npm run gen-gql`. You can then import the generated typed document node into your command file.

3.  **Register the Command**: Open `typescriptBot/src/services/slash-commands.service.ts` and import your new command array. Then, add it to the `loadCommands` method:

    ```typescript
    // ... other imports
    import { myNewCommands } from "../commands/my-command-folder/my-command";

    // ...

    loadCommands() {
        return [
        ...channelManagementCommand,
        ...avatarCommands,
        ...emoteCommands,
        ...listServersCommands,
        ...myNewCommands, // Add your new command here
        ];
    }
    ```

### Setup and Running

1.  Navigate to the `typescriptBot` directory: `cd typescriptBot`
2.  Install dependencies: `npm install`
3.  Create a `.env` file in the `typescriptBot` directory with the following content:
    ```
    TOKEN=your_discord_bot_token
    CLIENT_ID=your_bot_client_id
    GUILD_ID=your_test_server_id
    PRIVATE=your_discord_user_id
    ```
4.  Run the bot:
    - For development with automatic restarts: `npm run start:dev`
    - To generate GraphQL types: `npm run gen-gql`
    - To register commands globally: `npm run tsbot:dev:global` from the root directory.

## 🐍 Python Bot

The Python bot is a simpler implementation using `discord.py`. It uses hybrid commands, which means they also work as both prefix and slash commands.

### Setup and Running

1.  The bot uses a script to initialize a `variables.json` file for your token. Run `python3 pythonBot/initializeToken/initializeToken.py`. This will create `pythonBot/.pyenv/variables.json`. Edit this file to add your bot token.
2.  Install dependencies: `pip install -r requirements.txt` (You may need to create this file based on the imports in `main.py`). The main dependency is `discord.py`.
3.  Run the bot from the root directory: `python3 -m pythonBot.main.main`

## 🤖 Bot Comparison

| Feature           | 🔷 TypeScript Bot                                                             | 🐍 Python Bot                                            |
| ----------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------- |
| **Framework**     | [discord.js](https://discord.js.org/) v14                                     | `discord.py`                                             |
| **Command Types** | Separate logic for prefix and slash commands (`callback` and `slashCallback`) | Hybrid commands (works for both prefix and slash)        |
| **Configuration** | Uses a `.env` file for environment variables.                                 | Uses a `variables.json` file created by a helper script. |
| **Structure**     | Highly organized with services, models, and command separation.               | Mostly contained within a single `main.py` file.         |
| **Development**   | More developed with more commands and a robust structure.                     | Simpler, good for quick prototyping or smaller bots.     |

## 🎉 Creating Your Bot

To use this project, you'll need to create your own Discord bot.

1.  **Create a Bot Application**: Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.
2.  **Create a Bot User**: In your application's settings, go to the "Bot" tab and click "Add Bot".
3.  **Get Your Token**: Under the bot's username, you'll find a "Reset Token" button. This will give you the token to use in your `.env` or `variables.json` file. **Treat this token like a password!**
4.  **Enable Intents**: In the "Bot" tab, enable the "Presence Intent", "Server Members Intent", and "Message Content Intent".
5.  **Invite Your Bot**: Go to the "OAuth2" -> "URL Generator" tab. Select the `bot` and `applications.commands` scopes. Then, select the necessary permissions (e.g., "Send Messages", "Read Message History", "Manage Channels", "Manage Emojis and Stickers"). Copy the generated URL and paste it into your browser to invite the bot to your server.

For more detailed information, check out the official [discord.js guide](https://discordjs.guide/preparations/setting-up-a-bot-application.html).

