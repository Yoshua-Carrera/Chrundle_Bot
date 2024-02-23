from ..initializeToken.initializeToken import initializeToken

import typing
import discord
from discord import ChannelType, app_commands
from discord.ext import commands
import requests
import sys

sys.path.append('..')

guildId = None

env = initializeToken()

def parseStringIntoList(stringList):
    return [name for name in stringList.strip("[]").split(",")]


class UserData:
    def __init__(self, avatar, name) -> None:
        self.avatar = avatar
        self.name = name


class AlgoBot(commands.Bot):
    def __init__(self) -> None:
        intents = discord.Intents.default()
        intents.message_content = True
        intents.members = True
        super().__init__(command_prefix=".", intents=intents)

    async def setup_hook(self):
        await self.tree.sync(guild=discord.Object(guildId) if guildId else None)
        print("synced")


algoBot = AlgoBot()

@algoBot.hybrid_command(
    name="assify", description="turn word into ass", with_app_command=True
)
@app_commands.rename(content="content")
@app_commands.describe(content="Message content")
async def assify(interaction, *, content):
    message = content.lower().replace("the", "ass")
    await interaction.defer(ephemeral=True)
    await interaction.send(message)

@algoBot.hybrid_command(name="avatar", description="get avatar from the user")
@app_commands.rename(userid="user_id")
@app_commands.describe(userid="Enter a member Unique Identifier")
async def avatar(interaction, userid: typing.Optional[str]):
    member_array = []
    member_dict = []

    if userid:
        member_array = interaction.guild.members._SequenceProxy__copied
        member_dict = {
            member.id: {
                "avatar": (
                    member.avatar.url
                    if member.avatar is not None
                    else interaction.author.default_avatar
                ),
                "name": member.display_name,
            }
            for member in member_array
        }

    if userid:
        user_data = UserData(
            member_dict[int(userid)]["avatar"], member_dict[int(userid)]["name"]
        )
    else:
        user_data = UserData(
            (
                interaction.author.avatar.url
                if interaction.author.avatar is not None
                else interaction.author.default_avatar
            ),
            interaction.author.display_name,
        )

    embed = (
        discord.embeds.Embed(
            description=f"Avatar for: {user_data.name}", color=discord.Color.purple()
        )
        .set_image(url=user_data.avatar)
        .set_footer(text="nice")
    )

    await interaction.send(embed=embed)

@algoBot.hybrid_command(name="steal", description="Steal any emote")
@app_commands.rename(emoteURL="emote_url", emoteName="emote_name")
@app_commands.describe(emoteURL="Image URL Path", emoteName="Name of the new emote")
async def addEmoteToServer(ctx: commands.Context, emoteURL, emoteName: str):
    response = requests.get(emoteURL)
    try:
        await ctx.guild.create_custom_emoji(name=emoteName, image=response.content)
        await ctx.send(
            f"Added emote: {emoteName}, try using it by typing ``` :{emoteName}: ```"
        )
    except Exception as e:
        await ctx.send(f"error: {e.text}")
    except:
        await ctx.send("Something weird happened")

@algoBot.hybrid_command(name="rename_emote", description="Rename existing emote")
@app_commands.rename(emoteOldName="emote_old_name", emoteNewName="emote_new_name")
@app_commands.describe(emoteOldName="Emote old name", emoteNewName="Emote new name")
async def renameServerEmote(ctx: commands.Context, emoteOldName, emoteNewName):
    try:
        if emoteOldName == emoteNewName:
            await ctx.send(f"error: New and old name are identical")
        else:
            listOfEmotes = []
            emojis = await ctx.guild.fetch_emojis()
            for emote in emojis:
                listOfEmotes.append(emote.name)
                if emote.name == emoteOldName:
                    image = requests.get(emote.url).content
                    await emote.delete()
                    newWmote = await ctx.guild.create_custom_emoji(
                        name=emoteNewName, image=image
                    )
                    embed = discord.embeds.Embed(
                        color=discord.Color.random(), title="Change log"
                    )
                    embed.add_field(name="Emote", value=f"{newWmote}")
                    embed.add_field(name=f"Old name", value=f":{emoteOldName}:")
                    embed.add_field(name=f"New name", value=f":{newWmote.name}:")
                    embed.add_field(name=f"", value="\u200B" * 5, inline=False)
                    embed.set_footer(text="1/1", icon_url=env["BotAvatar"]).set_thumbnail(
                        url=emote.url
                    )
                    await ctx.send(embed=embed)
            if emoteNewName not in listOfEmotes:
                ctx.send(
                    f"error: {emoteNewName} not found among the current emotes in the server"
                )
    except Exception as e:
        await ctx.send(f"error: {e.text}")
    except:
        await ctx.send("Something weird happened")

@algoBot.hybrid_command(name="delete_emote", description="delete existing emote")
@app_commands.rename(emoteName="emote_name")
@app_commands.describe(emoteName="Emote name")
async def deleteServerEmote(ctx: commands.Context, emoteName):
    try:
        emojis = await ctx.guild.fetch_emojis()
        for emote in emojis:
            if emote.name == emoteName:
                await emote.delete()
                await ctx.send(f"Deleted emote: { emoteName }")
    except Exception as e:
        await ctx.send(f"error: {e.text}")
    except:
        await ctx.send("Something weird happened")

@algoBot.hybrid_command(name="add_channel", description="Create a brand new channel")
@app_commands.rename(channelName="channel_name")
@app_commands.describe(channelName="Channel Name")
async def createGuildChanel(ctx: commands.Context, channelName):
    try:
        await ctx.guild._create_channel(channelName, channel_type=ChannelType.text)
    except Exception as e:
        await ctx.send(f"error: {e.text}")
    except:
        await ctx.send("Something weird happened")


@algoBot.hybrid_command(name="nuke_channel", description="Delete an existing channel")
@app_commands.rename(channelId="channel_id")
@app_commands.describe(channelId="Channel ID")
async def nukeChannelById(ctx: commands.Context, channelId):
    try:
        embed = discord.embeds.Embed(color=discord.Color.random(), title="Change log")
        channel = await ctx.guild.fetch_channel(channelId)
        await channel.delete()
        embed.add_field(name="Deleted Channel", value=f"{channel.name}", inline=False)
        embed.add_field(name=f"", value="\u200B" * 5, inline=False)
        embed.set_footer(text="1/1", icon_url=env["BotAvatar"]).set_thumbnail(url=env["BotAvatar"])
        await ctx.send(embed=embed)
    except Exception as e:
        await ctx.send(f"error: {e.text}")
    except:
        await ctx.send("Something weird happened")

@algoBot.hybrid_command(name="nuke_category", description="Delete an existing category")
@app_commands.rename(categoryId="category_id")
@app_commands.describe(categoryId="Category ID")
async def nukeCategoryById(ctx: commands.Context, categoryId):
    try:
        embed = discord.embeds.Embed(color=discord.Color.random(), title="Change log")
        categories = ctx.guild.categories
        for cat in categories:
            if cat.id == int(categoryId):
                for textChannel in cat.text_channels:
                    await textChannel.delete()
                for voiceChannel in cat.voice_channels:
                    await voiceChannel.delete()
                await cat.delete()
                
                embed.add_field(name="Deleted Category", value=f"{cat.name}", inline=False)
        
        embed.add_field(name=f"", value="\u200B" * 5, inline=False)
        embed.set_footer(text="1/1", icon_url=env["BotAvatar"]).set_thumbnail(url=env["BotAvatar"])
        await ctx.send(embed=embed)
    except Exception as e:
        await ctx.send(f"error: {e.text}")
    except:
        await ctx.send("Something weird happened")

@algoBot.hybrid_command(
    name="create_category",
    description="Create a new category channel",
)
@app_commands.rename(
    categoryName="category_name",
    textChannels="array_of_text_channels",
    voiceChannels="array_of_voice_channels",
)
@app_commands.describe(
    categoryName="Category name",
    textChannels="An array of text channels to be created inside of the category",
    voiceChannels="An array of voice channels to be created inside of the category",
)
async def createNewCategory(
    ctx: commands.Context, categoryName, textChannels=None, voiceChannels=None
):
    try:
        metaData = {
            "text": [],
            "voice": []
        }
        embed = discord.embeds.Embed(color=discord.Color.random(), title="Change log")
        newCategoryName = await ctx.guild.create_category_channel(categoryName)
        if textChannels:
            cleanTextChannelList = parseStringIntoList(textChannels)
            for channelName in cleanTextChannelList:
                await newCategoryName.create_text_channel(channelName)
                metaData['text'].append(channelName)
        if voiceChannels:
            cleanvoiceChannelList = parseStringIntoList(voiceChannels)
            for channelName in cleanvoiceChannelList:
                await newCategoryName.create_voice_channel(channelName)
                metaData['voice'].append(channelName)
        
        embed.add_field(name="New Text Channels", value="{}".format(", ".join(metaData['text'])), inline=False)
        embed.add_field(name="New Voice Channels", value="{}".format(", ".join(metaData['voice'])), inline=False)
        embed.add_field(name=f"", value="\u200B" * 5, inline=False)
        embed.set_footer(text="1/1", icon_url=env["BotAvatar"]).set_thumbnail(url=env["BotAvatar"])
        await ctx.send(embed=embed)
    except Exception as e:
        await ctx.send(f"error: {e.text}")
    except:
        await ctx.send("Something weird happened")

if __name__ == '__main__':
    algoBot.run(env['Token'])