"use strict";
/**
 * Class implementing browser extension self distribution.
 *
 * @copyright <a href="http://donbidon.rf.gd/" target="_blank">donbidon</a>
 * @license https://opensource.org/licenses/mit-license.php
 */

/**
 * Class implementing browser extension self distribution.
 *
 * Example:
 * let distribution = new Distribution({
 *     // @see config.distribution section
 * });
 * // distribution.log = null; // Suppress debug output to browser console
 * distribution.modifyRequest = (data) => {
 *     // data.sign = ...;
 * };
 * distribution.onResponseReceived = (response) => {
 *     // ...
 * };
 * distribution.onInvalidResponseReceived = (xhr) => {
 *     // ...
 * };
 * distribution.onUpdateRequired = (response) => {
 *     // ...
 * };
 * distribution.run();
 */
class Distribution {
    /**
     * @param {Object} config - {@see core/config.js}, {@see core/background.js}
     */
    constructor(config) {
        /**
         * @property {Object}
         */
        this.log = config.log;
        delete config.log;

        /**
         * @property {boolean} - Flag specifying that response from remote service received or error occurred
         */
        this.finished = false;

        /**
         * @property {Object}
         * @private
         */
        this._config = config;

        /**
         * @property {string} - Current version of extension
         * @private
         */
        this._version = browser.runtime.getManifest().version;

        /**
         * @property {string} - Previous version of extension in case of updating
         * @private
         */
        this._previousVersion = null;
    }

    /**
     * Requests remote service and calls appropriate callback.
     */
    run() {
        let events = new RuntimeEvents();
        events.onInstalled = () => {
            this._onInstalled();
        };
        events.onUpdated = (previousVersion) => {
            this._onUpdated(previousVersion);
        };
        events.onStarted = () => {
            this._onStarted();
        };
        events.run(this._config.delayOnStart);
    }

    /**
     * Modifies request data like adding appropriate data, may be sign.
     * Should be overloaded.
     *
     * @param {Object} data
     */
    modifyRequest(data) {
    }

    /**
     * Called if remote service returned successful response.
     * Should be overloaded.
     *
     * @param {Object} response - Successful response data
     */
    onResponseReceived(response) {
        if (this.log) {
            this.log.method(
                "%c%s:%c Response received",
                this.log.style.header,
                this.log.header,
                this.log.style.common,
            );
            console.log(response);
        }
    }

    /**
     * Called if requesting remote service failed.
     * Should be overloaded.
     *
     * @param {XMLHttpRequest} xhr
     */
    onInvalidResponseReceived(xhr) {
        if (this.log) {
            console.error(
                "%c%s:%c Requesting remote service failed",
                this.log.style.header,
                this.log.header,
                this.log.style.common,
            );
            this.log.method(xhr);
        }
    }

    /**
     * Called if remote service returned different version then current and severity is critical.
     * Should be overloaded.
     *
     * @param {Object} response - Response data
     */
    onUpdateRequired(response) {
        if (this.log) {
            this.log.method(
                "%c%s:%c Update required",
                this.log.style.header,
                this.log.header,
                this.log.style.common,
            );
            this.log.method(response);
        }
    }

    /**
     * @private
     */
    _onInstalled() {
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
        this._checkForUpdates("installed");
    }

    /**
     * @param {string} previousVersion - Previous extension version
     * @private
     */
    _onUpdated(previousVersion) {
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
        this._previousVersion = previousVersion;
        this._checkForUpdates("updated");
    }

    /**
     * @private
     */
    _onStarted() {
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
        this._checkForUpdates("started");
    }

    /**
     * @param {string} event
     * @private
     */
    _checkForUpdates(event) {
        let request = { ...(this._config.request) };
        request.data.version = this._version;
        request.data.event = event;
        if ("updated" === event) {
            request.data.previousVersion = this._previousVersion;
        }
        this.modifyRequest(request.data);
        // console.log("request", request);///
        PromiseBasedXHR(request)
            .then((xhr) => {
                // console.log(xhr.response);///
                try {
                    const response = JSON.parse(xhr.response);
                    if (response.version > this._version && "critical" === response.severity) {
                        this.onUpdateRequired(response);
                    } else {
                        this.onResponseReceived(response);
                    }
                } catch (e) {
                    if (this.log) {
                        console.error(
                            "%c%s:%c Cannot parse JSON response",
                            this.log.style.header,
                            this.log.header,
                            this.log.style.common,
                        );
                        console.error(e);
                    }
                    this.onInvalidResponseReceived(xhr);
                }
            })
            .catch((xhr) => {
                this.onInvalidResponseReceived(xhr);
            })
            .finally(() => {
                this.finished = true;
            });
    }
}
