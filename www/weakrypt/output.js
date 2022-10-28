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

export function showError(customMessage, exception) {
    Output_resultboxEl.innerHTML = "";
    const pEl = document.createElement("p");
    pEl.textContent = `${customMessage}`;

    const elError = doc.createElement("p");
    elError.classList.add("errorMsg");
    elError.innerHTML = `<code>${exception}</code>`;
    Output_resultboxEl.appendChild(elError);
    if (exception.stack !== undefined) {
        const elStack = doc.createElement("pre");
        elStack.classList.add("stackTrace");
        elStack.textContent = `${exception.stack}`;
        Output_resultboxEl.appendChild(elStack);
    }
}

async function clipboardWriteText(txt) {
    await navigator.clipboard.writeText(txt);
}