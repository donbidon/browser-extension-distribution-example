"use strict";

/**
 * @param {Object} message
 * @returns {Promise<unknown>}
 */
function sendMessageToFrontend(message) {
    return new Promise((resolve, reject) => {
        browser.tabs.query({})
            .then((tabs) => {
                for (let tab of tabs) {
                    browser.tabs.sendMessage(tab.id, message).catch(() => {});
                }
                resolve();
            })
            .catch((e) => {
                console.error(e);
                reject(e);
            });
    });
}

// Close previously opened options pages and open new one
browser.tabs.query({
    url: browser.runtime.getURL(browser.runtime.getManifest().options_ui.page)
})
    .then((tabs) => {
        let tabIds = [];
        for (const i in tabs) {
            tabIds.push(tabs[i].id);
        }
        browser.tabs.remove(tabIds);
    })
    .finally(() => {
        browser.runtime.openOptionsPage();
    });

////////////////
const d = new DistributionBasedOnRuntimeEvents(config.distribution);
////////////////
// const d = new DistributionBasedOnStorage(config.distribution);
////////////

d._onResponseReceived = d.onResponseReceived;
d._onInvalidResponseReceived = d.onInvalidResponseReceived;
d._onUpdateRequired = d.onUpdateRequired;

d.modifyRequest = (data) => {
    data.sign = JSON.stringify(data).length;
};
d.onResponseReceived = (response) => {
    d._onResponseReceived(response);
    sendMessageToFrontend(Object.assign({ action: "onResponseReceived" }, response));
};
d.onInvalidResponseReceived = function (xhr) {
    d._onInvalidResponseReceived(xhr);
    sendMessageToFrontend(Object.assign({ action: "onInvalidResponseReceived" }));
};
d.onUpdateRequired = (response) => {
    d._onUpdateRequired(response);
    sendMessageToFrontend(Object.assign({ action: "onUpdateRequired" }, response));
};

d.run();
