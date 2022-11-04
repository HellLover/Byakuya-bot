import ByakuyaClient from "../structures/ByakuyaClient";
import { resolve } from "path";

import Event from "../structures/Event";
import { Command } from "../structures/Command/Command";
import { SubCommand } from "../structures/Command/SubCommand";

type Structures = Event | Command | SubCommand;

export async function resolveFile<T>(file: string, client: ByakuyaClient): Promise<T | null> {
    const resolvedPath = resolve(file);
  
    const File = await (await import(resolvedPath)).default;
  
    if (!File?.constructor) {
      return null;
    }
  
    return new File(client) as T;
}
  
export async function validateFile(file: string, item: Structures) {
    if (!item.name) {
      throw new TypeError(`[ERROR]: name is required! (${file})`);
    }
  
    if (!item.execute) {
      throw new TypeError(`[ERROR]: execute function is required! (${file})`);
    }
}