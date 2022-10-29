import * as Controller from "./controller.js";
import * as Input from "./input.js";
import * as Output from "./output.js";

/**
 * Init all sub modules
 * 
 * Call this first.
 */
export async function initSubModules() {
    Input.init();
    Output.init();
    await Controller.init();
}

(function onLoad() {
    initSubModules();
})();
