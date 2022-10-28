(async function montest() {  /* copy-paste from dev tools, only works in secure contexts, HTTPS */

    /* Sadly, seems to only work if salt and iv are the same for encrypt and decrypt,
       so it should be part of the password somehow ? :(
        
        For IV, the doc says :
        The initialization vector. Must be 16 bytes, unpredictable, and preferably cryptographically random. However, it need not be secret (for example, it may be transmitted unencrypted along with the ciphertext). 

        For salt, the doc says :

        https://datatracker.ietf.org/doc/html/rfc2898
        The salt can be
        viewed as an index into a large set of keys derived from the
        password, and need not be kept secret.
    */

    function toHex(buffer) {
        return Array.from(buffer).map(function byteToHex(b) {
            return b.toString(16).padStart(2, "0");
        }).join("")
    }

    function fromHex(s) {
        /* TODO */
        //const msg = "401e0b21ed38c6a79edfec7f7640e66265462b6e751454af1d8669c9c872";
        let array = [];
        let rest = s;
        let first2;
        while (rest.length > 0) {
            [first2, rest] = [rest.slice(0, 2), rest.slice(2)];
            array = [...array, parseInt(first2, 16)];
        }
        return new Uint8Array(array);
    }

    function encodeText(txt) {
        return (new TextEncoder()).encode(txt);
    }

    function decodeText(buffer) {
        return (new TextDecoder()).decode(buffer);
    }

    function getKeyMaterial(password) {
        return crypto.subtle.importKey(
            "raw",
            encodeText(password),
            { name: "PBKDF2" },
            false,
            ["deriveBits", "deriveKey"],
        );
    }

    function getKey(keyMaterial, salt) {
        return window.crypto.subtle.deriveKey(
            {
                "name": "PBKDF2",
                salt: salt,
                "iterations": 100000,
                "hash": "SHA-256"
            },
            keyMaterial,
            { "name": "AES-GCM", "length": 256 },
            true,
            ["encrypt", "decrypt"],
        );
    }

    async function encrypt(msg, password) {
        const keyMaterial = await getKeyMaterial(password);
        const salt = crypto.getRandomValues(new Uint8Array(16));
        const key = await getKey(keyMaterial, salt);
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encodedMsg = encodeText(msg);
        console.log("encodedMsg", encodedMsg);
        let cipherText = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv,
            },
            key,
            encodedMsg,
        );
        console.log("cipherText", cipherText);

        const buffer = new Uint8Array(cipherText, 0, cipherText.byteLength)
        console.log("buffer", buffer);
        return {
            encrypted: toHex(buffer),
            salt: toHex(salt),
            iv: toHex(iv),
        };
    }

    console.log("ENCRYPTING...");
    const { encrypted, salt, iv } = await encrypt("Hello <&é\"'(123)> sailor ! mlkjqsdl kjsqd lkjqsd lkjsdq mlkjsqd mlkj sdfqmlkjqsdf mlkj fsdqmlkj sdfqmlkj sqdf\nmlkjsqdmlkjsfdqmlkjfsqdmlkjsqdfmlkjfsqd\nlkjvcxlkjvxclkjvcx3542098235409354209('éàç('éàè_é'-à_('é:;,!;:,!:;,!:;,azeazeaze", "supersecure<\"é&321AZE>password");
    console.log("encrypted hex", encrypted);
    console.log("salt hex", salt);
    console.log("iv hex", iv);

    async function decrypt(password, { encrypted, salt, iv }) {
        const bufferBack = fromHex(encrypted);
        console.log("bufferBack", bufferBack);
        const saltBack = fromHex(salt);
        console.log("saltBack", saltBack);
        const ivBack = fromHex(iv);
        console.log("ivBack", ivBack);

        const keyMaterial = await getKeyMaterial(password);
        //salt = crypto.getRandomValues(new Uint8Array(16));
        const key = await getKey(keyMaterial, saltBack);
        //const iv = crypto.getRandomValues(new Uint8Array(12));

        /* WIP */
        try {
            let decrypted = await crypto.subtle.decrypt(
                {
                    name: "AES-GCM",
                    iv: ivBack,
                },
                key,
                bufferBack,
            );
            console.log("decrypted", decrypted);
            return decodeText(decrypted);
        } catch (e) {
            console.log("*** Decryption error ***", e);
        }

    }

    console.log("DECRYPTING...");
    const msgBack = await decrypt("supersecure<\"é&321AZE>password", { encrypted, salt, iv });
    console.log("msgBack", msgBack);
})()