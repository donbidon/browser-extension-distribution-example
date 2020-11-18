"use strict";

function sendMessageToFrontend(message) {
    return new Promise((resolve, reject) => {
        browser.tabs.query({})
            .then((tabs) => {
                for (let tab of tabs) {
                    browser.tabs.sendMessage(tab.id, message).catch((e) => {});
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

const distribution = new Distribution(config.distribution);
distribution.modifyRequest = (data) => {
    data.sign = JSON.stringify(data).length;
};
distribution.onResponseReceived = (response) => {
    sendMessageToFrontend(Object.assign({ action: "onResponseReceived" }, response));
};
distribution.onInvalidResponseReceived = (xhr) => {
    sendMessageToFrontend(Object.assign({ action: "onInvalidResponseReceived" }));
};
distribution.onUpdateRequired = (response) => {
    sendMessageToFrontend(Object.assign({ action: "onUpdateRequired" }, response));
};
setTimeout(() => {
    distribution.run();
}, 100)
