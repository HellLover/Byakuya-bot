import { ChatInputCommandInteraction, Events, Interaction } from "discord.js";
import Event from "../../structures/Event";
import ByakuyaClient from "../../structures/ByakuyaClient";

export default class ReadyEvent extends Event {
    constructor(client: ByakuyaClient) {
        super(client, Events.InteractionCreate)
    }

    async execute(interaction: Interaction) {
        if (!interaction.inCachedGuild()) return;
        if (!interaction.isChatInputCommand()) return;

        const command = this.client.commands.get(this.getCommandName(interaction));
        if(!command) return;

        try {
            if (command.validate) {
                const { ok, error } = await command.validate(interaction);
        
                if (!ok) {
                  // @ts-expect-error this works!
                  return interaction.reply(error);
                }
              }
        
              await command.execute(interaction);
            } catch (e) {
              if (interaction.replied) return;
        
              if (interaction.deferred) {
                interaction.editReply({ content: "An unknown error occured." });
            } else {
                interaction.reply({ ephemeral: true, content: "An unknown error occured." });
            }
        }
    }

    getCommandName(interaction: ChatInputCommandInteraction<"cached" | "raw">) {
      let command: string;
  
      const commandName = interaction.commandName;
      const group = interaction.options.getSubcommandGroup(false);
      const subCommand = interaction.options.getSubcommand(false);
  
      if (subCommand) {
        if (group) {
          command = `${commandName}-${group}-${subCommand}`;
        } else {
          command = `${commandName}-${subCommand}`;
        }
      } else {
        command = commandName;
      }
  
      return command;
    }
}