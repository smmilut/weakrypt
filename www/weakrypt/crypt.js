import { isBrowser, isNode, getGlobalObject } from "./envUtils.js";

/** The correct global subtleCrypto module */
const crypto = await (async function envLoadFile() {
    if (isBrowser()) {
        return (getGlobalObject()).crypto;
    } else if (isNode()) {
        return await import('node:crypto');
    } else {
        throw new Error("Only running in a web browser and Node are currently implemented.");
    }
})();

if (crypto === undefined || crypto.subtle === undefined) {
    throw new Error("SubtleCrypto API unavailable. Check that you are in a secure context.");
}

/**
 * @param {Uint8Array} buffer 
 * @returns {string} hex representation
 */
function hexFromBytesBuffer(buffer) {
    return Array.from(buffer).map(function byteToHex(b) {
        return b.toString(16).padStart(2, "0");
    }).join("")
}

/**
 * @param {string} hexString 
 * @returns {Uint8Array} buffer 
 */
function hexToUint8Array(hexString) {
    let array = [];
    let rest = hexString;
    let first2;
    while (rest.length > 0) {
        [first2, rest] = [rest.slice(0, 2), rest.slice(2)];
        array = [...array, parseInt(first2, 16)];
    }
    return new Uint8Array(array);
}

/**
 * @param {string} txt 
 * @returns stream of bytes
 */
function encodeText(txt) {
    return (new TextEncoder()).encode(txt);
}

/**
 * @param {Uint8Array} buffer 
 * @returns {string} decoded text
 */
function decodeText(buffer) {
    return (new TextDecoder()).decode(buffer);
}

/**
 * Turn a text password into crypto key material that can be derived into a key.
 * @param {string} password 
 * @returns {Promise} resolves to a basic CryptoKey
 */
function passwordToKey(password) {
    return crypto.subtle.importKey(
        "raw",
        encodeText(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"],
    );
}

/**
 * Make a stronger key from the password-derived key.
 * @param {CryptoKey} keyMaterial basic key
 * @param {ArrayBuffer,TypedArray,DataView} salt random or pseudo-random value of at least 16 bytes
 * @returns {Promise} resolves to a stronger CryptoKey
 */
function strengthenKey(keyMaterial, salt) {
    return crypto.subtle.deriveKey(
        {
            "name": "PBKDF2",
            salt,
            "iterations": 100000,
            "hash": "SHA-256"
        },
        keyMaterial,
        { "name": "AES-GCM", "length": 256 },
        true,
        ["encrypt", "decrypt"],
    );
}

function generateSalt() {
    return crypto.getRandomValues(new Uint8Array(16));
}

function generateIv() {
    return crypto.getRandomValues(new Uint8Array(12));
}

/**
 * @param {string} password  
 * @param {string} msg 
 * @returns {Object} { encryptedHex, saltHex, ivHex, }
 */
export async function encrypt(password, msg) {
    const encodedMsg = encodeText(msg);
    const keyMaterial = await passwordToKey(password);
    const salt = generateSalt();
    const key = await strengthenKey(keyMaterial, salt);
    const iv = generateIv();
    const encryptedMsg = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
        },
        key,
        encodedMsg,
    );

    const encryptedBuffer = new Uint8Array(encryptedMsg, 0, encryptedMsg.byteLength)
    return {
        encryptedHex: hexFromBytesBuffer(encryptedBuffer),
        saltHex: hexFromBytesBuffer(salt),
        ivHex: hexFromBytesBuffer(iv),
    };
}

/**
 * @param {*} password 
 * @param {Object} cipher { encryptedHex, saltHex, ivHex, } as hex strings
 * @returns {string} clear message
 */
export async function decrypt(password, { encryptedHex, saltHex, ivHex }) {
    const encryptedBuffer = hexToUint8Array(encryptedHex);
    const salt = hexToUint8Array(saltHex);
    const iv = hexToUint8Array(ivHex);

    const keyMaterial = await passwordToKey(password);
    const key = await strengthenKey(keyMaterial, salt);

    try {
        const encodedMsg = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv,
            },
            key,
            encryptedBuffer,
        );
        return decodeText(encodedMsg);
    } catch (e) {
        console.log("*** Decryption error ***", e);
        throw e;
    }
}

/**
 * @param {Object} cipher { encryptedHex, saltHex, ivHex, } as hex strings
 * @param {string} separator (optional)
 * @returns {string} single string containing all information
 */
export function serialize({ encryptedHex, saltHex, ivHex }, separator = "g") {
    return [saltHex, ivHex, encryptedHex].join(separator);
}

/**
 * @param {string} s single string containing all information
 * @param {*} separator (optional)
 * @returns {Object} cipher { encryptedHex, saltHex, ivHex, } as hex strings
 */
export function deserialize(s, separator = "g") {
    const [saltHex, ivHex, encryptedHex] = s.split(separator);
    return { encryptedHex, saltHex, ivHex };
}
