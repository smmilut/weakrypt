import * as Output from "./output.js";
import * as Crypt from "./crypt.js";

/** Always call init first */
export function init() {
}

/** Input sends new example text */
export async function onAskEncrypt(password, message) {
    const cipher = await Crypt.encrypt(password, message);
    const encrypted = Crypt.serialize(cipher);
    Output.showEncrypted(encrypted);
}

/** Input asks for imitations */
export async function onAskDecrypt(password, encrypted) {
    const cipher = Crypt.deserialize(encrypted);
    const decrypted = await Crypt.decrypt(password, cipher);
    Output.showEncrypted(decrypted);
}
