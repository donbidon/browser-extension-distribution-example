"use strict";

/**
 * {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onInstalled
 * browser.runtime.onInstalled} based distribution.<br /><br />
 *
 * See {@link https://github.com/donbidon/browser-extension-distribution-example
 * Self-distributed Google Chrome/Mozilla Firefox browsers extension}.
 *
 * @author {@link https://donbidon.rf.gd/ donbidon}
 * @license {@link https://opensource.org/licenses/mit-license.php MIT}
 */
class DistributionBasedOnRuntimeEvents extends Distribution {
    async run() {
        let events = new RuntimeEvents();
        events.onInstalled = async () => {
            await this.__onInstalled();
        };
        events.onUpdated = async (previousVersion) => {
            await this.__onUpdated(previousVersion);
        };
        events.onStarted = async () => {
            await this.__onStarted();
        };
        events.run(this.__config.delayOnStart);

        await super.run();
    }
}
