import * as DJS from "discord.js";
import ByakuyaClient from "structures/ByakuyaClient";
import { Command } from "../../structures/Command/Command";

export default class PingCommand extends Command {
  constructor(client: ByakuyaClient) {
    super(client, {
      name: "ping",
      description: "Returns the bot's ping",
    });
  }

  async execute(
    interaction: DJS.ChatInputCommandInteraction<"cached" | "raw">,
  ) {
    return interaction.reply({
      content: `Ping is: ${Math.round(this.client.ws.ping)}`,
    });
  }
}