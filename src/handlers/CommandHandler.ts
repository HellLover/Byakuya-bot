import glob from "glob";
import { resolveFile, validateFile } from "../utils/HandlerUtil";
import ByakuyaClient from "structures/ByakuyaClient";
import { Command } from "../structures/Command/Command";
import { SubCommand } from "../structures/Command/SubCommand";
import * as DJS from "discord.js";

export class CommandHandler {
    client: ByakuyaClient;

  constructor(client: ByakuyaClient) {
    this.client = client;

    this.createCommand = this.createCommand.bind(this);
  }

  async loadCommands() {
    try {
      const files = glob.sync("./src/commands/**/*.ts");

      /**
       * object of top-level names and sub commands
       */
      const subCommands: Record<string, SubCommand[]> = {};

      /** object of saved SUB_COMMAND that will be inside of a SUB_COMMAND_GROUP */
      const commandGroups: Record<string, [string, SubCommand[]]> = {};

      for (const file of files) {
        delete require.cache[file];

        const interaction = await resolveFile<Command | SubCommand>(file, this.client);
        if (!interaction) continue;
        await validateFile(file, interaction);

        let commandName;

        if (interaction instanceof SubCommand) {
          const groupName = interaction.options.groupName;
          const topLevelName = interaction.options.commandName;

          if (groupName) {
            const prev = commandGroups[groupName]?.[1] ?? [];

            commandGroups[groupName] = [topLevelName, [...prev, interaction]];
            commandName = `${topLevelName}-${groupName}-${interaction.name}`;
          } else if (topLevelName) {
            const prevSubCommands = subCommands[topLevelName] ?? [];
            subCommands[topLevelName] = [...prevSubCommands, interaction];
            commandName = `${topLevelName}-${interaction.name}`;
          }
        } else {
          commandName = interaction.name;

          const data: DJS.ApplicationCommandData = {
            type: DJS.ApplicationCommandType.ChatInput,
            name: interaction.name,
            description: interaction.options.description ?? "Empty description",
            options: interaction.options.options ?? [],
          };

          await this.createCommand(data);
        }

        this.client.commands.set(`${commandName}`, interaction);

        this.client.logger.info("COMMAND", `Loaded ${commandName}`)

      }

      for (const topLevelName in subCommands) {
        const cmds = subCommands[topLevelName];

        const data: DJS.ApplicationCommandData = {
          type: DJS.ApplicationCommandType.ChatInput,
          name: topLevelName,
          description: `${topLevelName} commands`,
          // @ts-expect-error ignore
          options: cmds.map((v) => v.options),
        };

        // todo: check if the topLevelCommand has a SUB_COMMAND_GROUP
        // if so, do not create it here because it will be re-created below
        await this.createCommand(data);
      }

      const groupCache: any[] = [];

      for (const groupName in commandGroups) {
        const [topLevelName, cmds] = commandGroups[groupName];

        const groupData = {
          type: DJS.ApplicationCommandOptionType.SubcommandGroup,
          name: groupName,
          description: `${groupName} sub commands`,
          options: cmds.map((v) => v.options),
        };

        groupCache.push(groupData);

        const data: DJS.ApplicationCommandData = {
          type: DJS.ApplicationCommandType.ChatInput,
          name: topLevelName,
          description: `${topLevelName} commands`,
          options: [...groupCache, ...subCommands[topLevelName].map((v) => v.options)],
        };

        await this.createCommand(data);
      }
    } catch (e) {
      this.client.logger.error(e);
    }
  }

  async createCommand(data: DJS.ApplicationCommandData) {
    if (process.env.DEV_MODE === "true") {
      const g = await this.client.guilds.fetch("742687873265958943");
      await g.commands.create(data).catch(console.error);
    } else {
      await this.client.application?.commands.create(data);
    }
  }
}