import process from "node:process";
import * as DJS from "discord.js";
import { codeBlock, inlineCode } from "@discordjs/builders";
import { inspect } from "node:util";
import ByakuyaClient from "../../structures/ByakuyaClient";
import { SubCommand } from "../../structures/Command/SubCommand";
import { ValidateReturn } from "../../structures/Command/BaseCommand";

const classified = [
  "this.client.config",
  "this.client.token",
  "process.env",
  // eslint-disable-next-line quotes
  'client["token"]',
  "client['token']",
];

export default class EvalSubCommand extends SubCommand {
  constructor(client: ByakuyaClient) {
    super(client, {
      name: "eval",
      description: "Execute a JavaScript code.",
      commandName: "owner",
      options: [
        {
          type: DJS.ApplicationCommandOptionType.String,
          name: "code",
          description: "The code you want to execute",
          required: true,
        },
        {
          type: DJS.ApplicationCommandOptionType.Boolean,
          name: "ephemeral",
          description: "Whether the command should be ephemeral.",
          required: false,
        },
      ],
    });
  }

  async validate(
    interaction: DJS.ChatInputCommandInteraction<"cached" | "raw">,
  ): Promise<ValidateReturn> {
    const owner = process.env["OWNER"];
    const isOwner = interaction.user.id === owner;

    if (!isOwner) {
      return { ok: false, error: { ephemeral: true, content: "This command is for the owners only." } };
    }

    return { ok: true };
  }

  async execute(interaction: DJS.ChatInputCommandInteraction<"cached" | "raw">) {
    
    try {
      const ephemeral = interaction.options.getBoolean("ephemeral") ?? false;
      await interaction.deferReply({ ephemeral });
      const code = interaction.options.getString("code", true);
      let wasCanceled = false;

      classified.forEach((item) => {
        if (code.toLowerCase().includes(item)) {
          wasCanceled = true;
        }
      });

      if (wasCanceled) {
        return interaction.editReply({
          content: "That operation was canceled because it can include tokens or secrets.",
        });
      }

      // eslint-disable-next-line no-eval
      let evaluatedCode = await eval(code);
      const typeOf = typeof evaluatedCode;

      evaluatedCode = inspect(evaluatedCode, {
        depth: 0,
        maxArrayLength: null,
      });

      const type = typeOf[0].toUpperCase() + typeOf.slice(1);

      const embed = new DJS.EmbedBuilder()
        .setTitle("Successfully executed the code")
        .setColor("Yellow")
        .setDescription(`
            ${inlineCode("Eval Type")}: ${type}
            ${inlineCode("Input")}: ${codeBlock("js", code)}
            ${inlineCode("Output")}: ${codeBlock("js", evaluatedCode)}
        `);

      await interaction.editReply({ embeds: [embed] });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown Error";

      const embed = new DJS.EmbedBuilder()
        .setTitle("Error occured")
        .setColor("Red")
        .setDescription(codeBlock(message));

      return interaction.editReply({ embeds: [embed] });
    }
  }
}