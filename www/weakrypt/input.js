import * as Controller from "./controller.js";
/**
 * manage user input and communicate with the Controller
 */

let Input_messageEl;
let Input_passwordEl;
let Input_encryptButton;
let Input_decryptButton;

/** Always call init first */
export function init(
    {
        messageQry = "#message",
        passwordQry = "#password",
        encryptButtonQry = "#encryptButton",
        decryptButtonQry = "#decryptButton",
    } = {},
) {
    Input_messageEl = document.querySelector(messageQry);
    Input_passwordEl = document.querySelector(passwordQry);
    Input_encryptButton = document.querySelector(encryptButtonQry);
    Input_encryptButton.addEventListener("click", encryptClicked);
    Input_decryptButton = document.querySelector(decryptButtonQry);
    Input_decryptButton.addEventListener("click", decryptClicked);
}

function encryptClicked(_event) {
    const message = Input_messageEl.value;
    const password = Input_passwordEl.value;
    Controller.onAskEncrypt(password, message);
}

function decryptClicked(_event) {
    const cipher = Input_messageEl.value;
    const password = Input_passwordEl.value;
    Controller.onAskDecrypt(password, cipher);
}
