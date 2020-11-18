"use strict";

/**
 * Class handling installing/updating runtime events and start of browser extension.
 *
 * Example:
 * let runtimeEvents = new RuntimeEvents();
 * runtimeEvents.onInstalled = () => {
 *     console.log("onInstalled");
 * };
 * runtimeEvents.onUpdated = (previousVersion) => {
 *     console.log("onUpdated, from previous version %s", previousVersion);
 * };
 * runtimeEvents.onStarted = () => {
 *     console.log("onStarted");
 * };
 * runtimeEvents.run(10);
 */
class RuntimeEvents {
    constructor() {
        /**
         * @property {string} - Current version of extension
         * @private
         */
        this._version = browser.runtime.getManifest().version;

        /**
         * @property {boolean} - Internal flag
         * @private
         */
        this._started = false;
    }

    /**
     * Called when extension is just installed.
     * Should be overloaded.
     */
    onInstalled() {
    }

    /**
     * Called when extension is updated.
     * Should be overloaded.
     *
     * @param {string} previousVersion
     */
    onUpdated(previousVersion) {
    }

    /**
     * Called when extension is started.
     * Should be overloaded.
     */
    onStarted() {
    }

    /**
     * Adds listeners after object is configured.
     *
     * @param {int} delay - Delay to start after registering browser.runtime.onInstalled listener.
     */
    run(delay) {
        browser.runtime.onInstalled.addListener((details) => {
            this._onInstalled(details);
        });
        setTimeout(() => {
            this._onStart();
        }, delay);
    }

    /**
     * @param {Object} details - See
     * {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onInstalled}
     * @private
     */
    _onInstalled(details) {
        switch (details.reason) {
            case "install":
                this._started = true;
                this.onInstalled();
                break; // case "install"

            case "update":
                let previousVersion = details.previousVersion;
                if (previousVersion !== this._version) {
                    this._started = true;
                    this.onUpdated(previousVersion);
                }
                break; // case "update"
        }
    }

    /**
     * @private
     */
    _onStart() {
        if (this._started) {
            return;
        }
        this.onStarted();
    }
}
