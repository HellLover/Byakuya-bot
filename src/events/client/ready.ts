import { ActivityType, Events } from "discord.js";
import Event from "../../structures/Event";
import ByakuyaClient from "../../structures/ByakuyaClient";
import { CommandHandler } from "../../handlers/CommandHandler";

export default class ReadyEvent extends Event {
    constructor(client: ByakuyaClient) {
        super(client, Events.ClientReady)
    }

    async execute() {
        await new CommandHandler(this.client).loadCommands();

        this.client.logger.info("CONNECTION", `Successfully connected to the WS as Byakuya#${this.client?.user?.discriminator}!`)

        void this.client.user?.setPresence({
            activities: [
                {
                    name: "bankai",
                    type: ActivityType.Streaming,
                    url: "https://www.youtube.com/watch?v=Q23Kf1SC-pI&ab_channel=Zanoxyte"
                }
            ]
        })
    }
}