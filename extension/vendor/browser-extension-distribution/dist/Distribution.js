"use strict";

/**
 * Distribution abstract class.
 *
 * @abstract
 * @author {@link https://donbidon.rf.gd/ donbidon}
 * @license {@link https://opensource.org/licenses/mit-license.php MIT}
 */
class Distribution {
    /**
     * @param {Object} config - See {@link https://github.com/donbidon/browser-extension-distribution-example
     * Self-distributed Google Chrome/Mozilla Firefox browsers extension}
     */
    constructor(config) {
        /**
         * @property {Object}
         */
        this.log = config.log;
        delete config.log;

        /**
         * @property {boolean}
         */
        this.responseReceived = false;

        /**
         * @property {Object}
         * @protected
         */
        this.__config = config;

        /**
         * @property {string} - Current version of extension
         * @protected
         */
        this.__version = browser.runtime.getManifest().version;

        /**
         * @property {string} - Previous version of extension in case of updating
         * @private
         */
        this._previousVersion = null;
    }

    /**
     * Called after setting appropriate callbacks.
     */
    async run() {
        while (!this.responseReceived) {
            await new Promise(resolve => setTimeout(resolve, 1));
        }
    }

    /**
     * Modifies request like adding appropriate data, may be sign.
     * Can be overloaded.
     *
     * @param {Object} data
     */
    modifyRequest(data) {
    }

    /**
     * Decide about updates.
     * Can be overloaded.
     *
     * @param {Object} response
     */
    processResponse(response) {
        let callOnResponseReceived = true;
        for (let update of response.updates) {
            if (update.version > this.__version && "critical" === update.severity) {
                callOnResponseReceived = false;
                this.onUpgradeRequired(response, update);
                break;
            }
        }
        if (callOnResponseReceived) {
            this.onResponseReceived(response);
        }
    }

    /**
     * Called if remote service returned successful response.
     * Can be overloaded.
     *
     * @param {Object} response - Successful response data
     */
    onResponseReceived(response) {
        if (this.log) {
            this.log.method(
                "%c%s:%c Response received:",
                this.log.style.header,
                this.log.header,
                this.log.style.common,
                response,
            );
        }
    }

    /**
     * Called if requesting remote service failed.
     * Can be overloaded.
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
            console.error(xhr);
        }
    }

    /**
     * Called if remote service returned different version then current and severity is critical.
     * Can be overloaded.
     *
     * @param {Object} response - Response data
     * @param {Object} update
     */
    onUpgradeRequired(response, update) {
        if (this.log) {
            this.log.method(
                "%c%s:%c Update required:",
                this.log.style.header,
                this.log.header,
                this.log.style.common,
                update,
            );
        }
    }

    /**
     * @protected
     */
    __onInstalled() {
        if (this.log) {
            this.log.method(
                "%c%s: %c%s%c version installed",
                this.log.style.header,
                this.log.header,
                this.log.style.version,
                this.__version,
                this.log.style.common,
            );
        }
        return this._checkForUpdates("installed");
    }

    /**
     * @param {string} previousVersion - Previous extension version
     * @protected
     */
    __onUpdated(previousVersion) {
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
                this.__version,
                this.log.style.common,
            );
        }
        this._previousVersion = previousVersion;
        return this._checkForUpdates("updated");
    }

    /**
     * @protected
     */
    __onStarted() {
        if (this.log) {
            this.log.method(
                "%c%s: %c%s%c version started",
                this.log.style.header,
                this.log.header,
                this.log.style.version,
                this.__version,
                this.log.style.common,
            );
        }
        return this._checkForUpdates("started");
    }

    /**
     * @param {string} event
     * @private
     */
    async _checkForUpdates(event) {
        let request = { ...(this.__config.request) };
        request.data.version = this.__version;
        request.data.event = event;
        if ("updated" === event) {
            request.data.previousVersion = this._previousVersion;
        }
        this.modifyRequest(request.data);
        if (this.log) {
            this.log.method(
                "%c%s:%c Sending request:",
                this.log.style.header,
                this.log.header,
                this.log.style.common,
                request,
            );
        }
        await new Promise(resolve => setTimeout(resolve, this.__config.delayBeforeRequest));
        PromiseBasedXHR(request)
            .then((xhr) => {
                try {
                    const response = JSON.parse(xhr.response);
                    this.processResponse(response);
                } catch (e) {
                    if (this.log) {
                        console.error(
                            "%c%s:%c Invalid response",
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
                this.responseReceived = true;
            });
    }
}
