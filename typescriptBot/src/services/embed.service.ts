import {
  ActionRowBuilder,
  AnyComponentBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import {
  InteractionID,
  NavigationButtons,
} from "../models/discord-embed.models";

export class EmbedService {
  navigationButtons(): NavigationButtons {
    const firstPageButton: ButtonBuilder = new ButtonBuilder()
      .setCustomId(InteractionID.PAGE_FIRST)
      .setLabel("First")
      .setStyle(ButtonStyle.Primary);
    const previousPageButton: ButtonBuilder = new ButtonBuilder()
      .setCustomId(InteractionID.PAGE_PREVIOUS)
      .setLabel("Previous")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true);
    const nextPageButton: ButtonBuilder = new ButtonBuilder()
      .setCustomId(InteractionID.PAGE_NEXT)
      .setLabel("Next")
      .setStyle(ButtonStyle.Primary);
    const lastPageButton: ButtonBuilder = new ButtonBuilder()
      .setCustomId(InteractionID.PAGE_LAST)
      .setLabel("Last")
      .setStyle(ButtonStyle.Primary);

    return {
      firstPageButton,
      previousPageButton,
      nextPageButton,
      lastPageButton,
    };
  }

  buildActionRow(buttons: NavigationButtons = this.navigationButtons()) {
    return new ActionRowBuilder().addComponents(Object.values(buttons));
  }
}
