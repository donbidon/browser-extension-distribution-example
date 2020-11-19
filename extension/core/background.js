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
d._onUpgradeRequired = d.onUpgradeRequired;

d.modifyRequest = (data) => {
    data.sign = JSON.stringify(data).length;
};
d.onResponseReceived = (response) => {
    d._onResponseReceived(response);
    sendMessageToFrontend({
        action: "onResponseReceived",
        response: response,
    });
};
d.onInvalidResponseReceived = function (xhr) {
    d._onInvalidResponseReceived(xhr);
    let response;
    try {
        response = JSON.parse(xhr.response);
    } catch (e) {
        response = xhr.response;
    }
    sendMessageToFrontend({
        action: "onInvalidResponseReceived",
        response: response,
    });
};
d.onUpgradeRequired = (response, update) => {
    d._onUpgradeRequired(response, update);
    sendMessageToFrontend({
        action: "onUpgradeRequired",
        response: response,
        update: update,
    });
};

(async () => {
    await d.run();
})().then(() => {
    console.info("Response processed");///
});
