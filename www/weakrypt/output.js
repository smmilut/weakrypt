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
    const encryptedEl = document.createElement("pre");
    encryptedEl.classList.add("encrypted");
    encryptedEl.textContent = `${encryptedHex}`;
    Output_resultboxEl.appendChild(encryptedEl);
    clipboardWriteText(encryptedHex);
}

export function showDecrypted(decryptedText) {
    Output_resultboxEl.innerHTML = "";
    const decryptedEl = document.createElement("p");
    decryptedEl.classList.add("decrypted");
    decryptedEl.textContent = `${decryptedText}`;
    Output_resultboxEl.appendChild(decryptedEl);
    clipboardWriteText(decryptedText);
}

export function showError(customMessage, exception) {
    Output_resultboxEl.innerHTML = "";
    const messageEl = document.createElement("p");
    messageEl.classList.add("errorMsg");
    messageEl.textContent = `${customMessage}`;
    Output_resultboxEl.appendChild(messageEl);

    if (exception) {
        const exceptionEl = document.createElement("p");
        exceptionEl.classList.add("exceptionMsg");
        exceptionEl.innerHTML = `<code>${exception}</code>`;
        Output_resultboxEl.appendChild(exceptionEl);
        if (exception.stack) {
            const stackEl = document.createElement("pre");
            stackEl.classList.add("stackTrace");
            stackEl.textContent = `${exception.stack}`;
            Output_resultboxEl.appendChild(stackEl);
        }
    }
}

async function clipboardWriteText(txt) {
    await navigator.clipboard.writeText(txt);
}