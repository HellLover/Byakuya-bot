import "dotenv/config";
///////////////////////

import { SubCommand } from "./Command/SubCommand";
import { Command } from "./Command/Command";
import { EventHandler } from "../handlers/EventHandler";
import { Logger } from "../utils/Logger";

import { Client, ClientOptions, Collection } from "discord.js";
////////////////////////////////////////////////////////////////

class ByakuyaClient extends Client {
    commands: Collection<string, SubCommand | Command> = new Collection();
    
    logger: Logger = new Logger(null);

    constructor(options: ClientOptions) {
        super(options)
    }

    async init() {
        new EventHandler(this).loadEvents();

        this.login(process.env["BYAKUYA_TOKEN"]);
    }
}

export default ByakuyaClient;