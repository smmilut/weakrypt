import * as Output from "./output.js";
import * as Crypt from "./crypt.js";

/** Always call init first */
export function init() {
}

export async function onAskEncrypt(password, message) {
    const cipher = await Crypt.encrypt(password, message);
    const encrypted = Crypt.serialize(cipher);
    Output.showEncrypted(encrypted);
}

export async function onAskDecrypt(password, encrypted) {
    const cipher = Crypt.deserialize(encrypted);
    const { encryptedHex, saltHex, ivHex, } = cipher;
    if (encryptedHex === undefined || saltHex === undefined || ivHex === undefined) {
        Output.showError("Deserializing Error while getting the message. Check the separator used.")
        return;
    }
    try {
        const decrypted = await Crypt.decrypt(password, cipher);
        Output.showEncrypted(decrypted);
    } catch (error) {
        if (error instanceof DOMException) {
            Output.showError("Decryption Error while decrypting. Check password and encrypted text for errors.")
        } else {
            Output.showError("Unknown Error while decrypting.", error)
        }
    }
}
