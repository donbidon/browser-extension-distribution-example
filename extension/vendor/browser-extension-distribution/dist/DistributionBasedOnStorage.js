"use strict";

/**
 * {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage browser.storage}
 * based distribution.<br /><br />
 *
 * See {@link https://github.com/donbidon/browser-extension-distribution-example
 * Self-distributed Google Chrome/Mozilla Firefox browsers extension}.
 *
 * @author {@link https://donbidon.rf.gd/ donbidon}
 * @license {@link https://opensource.org/licenses/mit-license.php MIT}
 */
class DistributionBasedOnStorage extends Distribution {
    async run() {
        const previousVersion = await this._getVersion();
        if (null === previousVersion) {
            await this._setVersion(this.__version);
            await this.__onInstalled();
        } else if (previousVersion !== this.__version) {
            await this._setVersion(this.__version);
            await this.__onUpdated(previousVersion);
        } else {
            await this.__onStarted();
        }

        await super.run();
    }

    /**
     * @returns {string|null}
     * @private
     */
    async _getVersion() {
        let version = null;
        await this.__config.storage.get({version: null})
            .then((data) => {
                version = data.version;
            });
        return version;
    }

    /**
     * @param {string} version
     * @returns {Promise<*>}
     * @private
     */
    _setVersion(version) {
        return this.__config.storage.set({version: version});
    }
}
