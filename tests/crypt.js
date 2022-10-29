import * as Crypt from "../www/weakrypt/crypt.js";
import { groupIt, assert } from "../utils/femtest/test.js";
const itShould = groupIt("crypt.js")

itShould("encrypt and decrypt", async function testEncrypt() {
    await Crypt.init();
    const message = "Hello <&é\"'(123)> sailor ! mlkjqsdl sqdf\nmlsdmkfsqd\nlcx3542209è_-à_';:,!aze";
    const password = "supersecure<\"é&321AZE>password";

    const { encryptedHex, saltHex, ivHex } = await Crypt.encrypt(password, message);

    const decryptedMsg = await Crypt.decrypt(password, { encryptedHex, saltHex, ivHex });

    assert.strictEqual(message, decryptedMsg);
});

itShould("serialize", async function testSerialize() {
    await Crypt.init();
    const cipher = {
        encryptedHex: "ffffff",
        saltHex: "000000",
        ivHex: "123456",
    };
    const separator = "h";
    const expected = "000000h123456hffffff";
    const result = Crypt.serialize(cipher, separator);
    assert.strictEqual(result, expected);
});

itShould("deserialize", async function testDeserialize() {
    await Crypt.init();
    const cipher = "000000h123456hffffff";
    const separator = "h";
    const expected = {
        encryptedHex: "ffffff",
        saltHex: "000000",
        ivHex: "123456",
    };
    const result = Crypt.deserialize(cipher, separator);
    assert.objectsJsonEqual(result, expected);
});
