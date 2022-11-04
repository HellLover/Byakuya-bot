import glob from "glob";
import ByakuyaClient from "structures/ByakuyaClient";
import Event from "../structures/Event";
import { resolveFile, validateFile } from "../utils/HandlerUtil";

export class EventHandler {
  client: ByakuyaClient;

  constructor(client: ByakuyaClient) {
    this.client = client;
  }

  async loadEvents() {

    const files = glob.sync("./src/events/**/*.ts");

    for (const file of files) {
      delete require.cache[file];

      const event = await resolveFile<Event>(file, this.client);
      if (!event) continue;
      await validateFile(file, event);

      if (!event.execute) {
        throw new TypeError(`[ERROR][events]: execute function is required for events! (${file})`);
      }

      if (event.once) {
        this.client.once(event.name, (...args) => event.execute(...args));
      } else {
        this.client.on(event.name, (...args) => event.execute(...args));
      }

      this.client.logger.info("EVENT", `Loaded ${event.name}`)
    }
  }
}