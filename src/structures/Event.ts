import ByakuyaClient from "./ByakuyaClient";
import { ClientEvents } from "discord.js";

export default abstract class Event {
    client: ByakuyaClient;
    name: keyof ClientEvents;
    once: boolean;
  
    constructor(client: ByakuyaClient, name: keyof ClientEvents, once = false) {
      this.client = client;
      this.name = name;
      this.once = once;
  
      this.execute = this.execute.bind(this);
    }

    abstract execute(...args: any[]): Promise<any>;
  }