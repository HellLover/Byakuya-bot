import ByakuyaClient from "./structures/ByakuyaClient";
import { intents } from "./config/config";

const Byakuya = new ByakuyaClient({
    intents
});

Byakuya.init();