import * as Controller from "./controller.js";
import * as Input from "./input.js";
import * as Output from "./output.js";

/**
 * Init all sub modules
 * 
 * Call this first.
 */
 function initSubModules() {
    Input.init();
    Output.init();
    Controller.init();
}

(async function onLoad() {
    const testClip = await navigator.clipboard.readText();
    console.log("you had", testClip);
    await navigator.clipboard.writeText("written to clipboard from this page on " + (new Date()));
    initSubModules();
})();
