import * as DJS from "discord.js";
import ByakuyaClient from "structures/ByakuyaClient";

export interface BaseCommandOptions {
  name: string;
  description: string;
  memberPermissions?: bigint[];
  botPermissions?: bigint[];
  options?: DJS.ApplicationCommandOptionData[];
}

export interface ValidateReturn {
  ok: boolean;
  error?: DJS.MessagePayload | DJS.InteractionReplyOptions;
}

export abstract class BaseCommand<TOptions extends BaseCommandOptions = BaseCommandOptions> {
  protected _options: TOptions;
  client: ByakuyaClient;
  name: string;

  constructor(client: ByakuyaClient, options: TOptions) {
    this.client = client;
    this.name = options.name;
    this._options = options;

    this.validate = this.validate?.bind(this);
    this.execute = this.execute.bind(this);
  }

  get options(): TOptions {
    return this._options;
  }

  validate?(
    interaction: DJS.CommandInteraction,
  ): Promise<ValidateReturn>;

  abstract execute(
    interaction: DJS.CommandInteraction,
  ): Promise<unknown>;
}