/**
 * manage how to display output
 */

/** HTML element to display results */
let Output_resultboxEl;

/** Always call init first */
export function init(
    {
        resultboxQry = "#resultbox",
    } = {},
) {
    Output_resultboxEl = document.querySelector(resultboxQry);
}

export function showEncrypted(encryptedHex) {
    Output_resultboxEl.innerHTML = "";
    const preEl = document.createElement("pre");
    preEl.textContent = `${encryptedHex}`;
    Output_resultboxEl.appendChild(preEl);
    clipboardWriteText(encryptedHex);
}

export function showDecrypted(decryptedText) {
    Output_resultboxEl.innerHTML = "";
    const pEl = document.createElement("p");
    pEl.textContent = `${decryptedText}`;
    Output_resultboxEl.appendChild(pEl);
    clipboardWriteText(decryptedText);
}

async function clipboardWriteText(txt) {
    await navigator.clipboard.writeText(txt);
}