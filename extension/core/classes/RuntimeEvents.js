"use strict";

/**
 * Class handling installing/updating runtime events and starting of browser extension.
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
     * Called if extension is just installed.
     * Can be overloaded.
     */
    onInstalled() {
    }

    /**
     * Called if extension version changed.
     * Can be overloaded.
     *
     * @param {string} previousVersion
     */
    onUpdated(previousVersion) {
    }

    /**
     * Called if extension is started.
     * Can be overloaded.
     */
    onStarted() {
    }

    /**
     * Adds listeners after object is configured.
     *
     * @param {int} delay - Delay to process browser.runtime.onInstalled event if happened
     * before calling this.onStarted()
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
                    if (previousVersion < this._version) {
                        this.onUpdated(previousVersion);
                    } else {
                        this.onUpdated(previousVersion);
                    }
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
