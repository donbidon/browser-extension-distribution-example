"use strict";

/**
 * Class handling installing, updating and starting events of browser extension.
 *
 * Example:
 * let events = new ExtensionGlobalEvents();
 * // events.log = null; // Suppress debug output to browser console
 * events.onInstalled = () => {
 *     console.log("onInstalled");
 * };
 * events.onUpdated = (previousVersion) => {
 *     console.log("onUpdated, from previous version %s", previousVersion);
 * };
 * events.onStarted = () => {
 *     console.log("onStarted");
 * };
 * events.run(100);
 */
class ExtensionGlobalEvents {
    constructor() {
        /**
         * @property {object} - Logging config
         */
        this.log = {
            method: console.info,
            header: "Global event",
            style: {
                header: "font-style: italic; font-weight: bold; color: lightgreen;",
                version: "font-style: italic; font-weight: bold; color: yellow;",
                common: "font-style: italic;",
            },
        };

        /**
         * @property {function} - Callback will be called when extension is just installed
         */
        this.onInstalled = null;

        /**
         * @property {function} - Callback will be called when extension is updated
         */
        this.onUpdated = null;

        /**
         * @property {function} - Callback will be called when extension is started
         */
        this.onStarted = null;

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
     * Adds listeners after object is configured.
     *
     * @param {int} timeout - Timeout to start after registering browser.runtime.onInstalled listener.
     */
    run(timeout) {
        browser.runtime.onInstalled.addListener((details) => {
            this._onInstalled(details);
        });
        const timer = setTimeout(() => {
            clearTimeout(timer);
            this._onStart();
        }, timeout);
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
                if (this.log) {
                    this.log.method(
                        "%c%s: %c%s%c version installed",
                        this.log.style.header,
                        this.log.header,
                        this.log.style.version,
                        this._version,
                        this.log.style.common,
                    );
                }
                if (this.onInstalled) {
                    this.onInstalled();
                }
                break; // case "install"

            case "update":
                let previousVersion = details.previousVersion;
                if (previousVersion !== this._version) {
                    this._started = true;
                    if (this.log) {
                        this.log.method(
                            "%c%s:%c updated from %c%s%c to %c%s%c version",
                            this.log.style.header,
                            this.log.header,
                            this.log.style.common,
                            this.log.style.version,
                            previousVersion,
                            this.log.style.common,
                            this.log.style.version,
                            this._version,
                            this.log.style.common,
                        );
                    }
                    if (this.onUpdated) {
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
        if (this.log) {
            this.log.method(
                "%c%s: %c%s%c version started",
                this.log.style.header,
                this.log.header,
                this.log.style.version,
                this._version,
                this.log.style.common,
            );
        }
        if (this.onStarted) {
            this.onStarted();
        }
    }
}
