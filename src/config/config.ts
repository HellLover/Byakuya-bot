import { GatewayIntentBits } from "discord.js";

export const intents: GatewayIntentBits[] = [
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
]