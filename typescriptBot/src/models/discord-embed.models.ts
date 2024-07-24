import { ButtonBuilder } from "discord.js";

export enum EmbedColor {
    WHITE= "White",
    AQUA= "Aqua",
    GREEN= "Green",
    BLUE= "Blue",
    YELLOW= "Yellow",
    PURPLE= "Purple",
    LUMINOUSVIVIDPINK= "LuminousVividPink",
    FUCHSIA= "Fuchsia",
    GOLD= "Gold",
    ORANGE= "Orange",
    RED= "Red",
    GREY= "Grey",
    NAVY= "Navy",
    DARKAQUA= "DarkAqua",
    DARKGREEN= "DarkGreen",
    DARKBLUE= "DarkBlue",
    DARKPURPLE= "DarkPurple",
    DARKVIVIDPINK= "DarkVividPink",
    DARKGOLD= "DarkGold",
    DARKORANGE= "DarkOrange",
    DARKRED= "DarkRed",
    DARKGREY= "DarkGrey",
    DARKERGREY= "DarkerGrey",
    LIGHTGREY= "LightGrey",
    DARKNAVY= "DarkNavy",
    BLURPLE= "Blurple",
    GREYPLE= "Greyple",
    DARKBUTNOTBLACK= "DarkButNotBlack",
    NOTQUITEBLACK= "NotQuiteBlack",
  }

export enum EmbedTitles {
  SERVER_LIST='Server List',
  SERVER_CHANNEL_LIST='Server Channels'
}

export enum EmbedDescription {
  SERVER_LIST='List of servers the bot is currently in:',
  SERVER_CHANNEL_LIST='List of channles of a server the bot is currently in:'
}

export enum EmbedFields {
  NAME='Name',
  ID="ID",
  SPACE="\u200B",
  EMPTY=" "
}

export enum EmbedFieldValues {
  DASH_SEPARATOR='------',
}

export interface NavigationButtons {
  firstPageButton: ButtonBuilder;
  previousPageButton: ButtonBuilder;
  nextPageButton: ButtonBuilder;
  lastPageButton: ButtonBuilder;
}

export enum InteractionID {
  PAGE_FIRST="pageFirst",
  PAGE_PREVIOUS="pagePrevious",
  PAGE_NEXT="pageNext",
  PAGE_LAST="pageLast",
}