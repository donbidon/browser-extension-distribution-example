"use strict";
/**
 * @copyright <a href="http://donbidon.rf.gd/" target="_blank">donbidon</a>
 * @license https://opensource.org/licenses/mit-license.php
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
    }
}
