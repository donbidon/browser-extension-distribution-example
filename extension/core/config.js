"use strict";

const config = {
    distribution: {
        log: {
            method: console.info,
            header: "Distribution",
            style: {
                header: "font-style: italic; font-weight: bold; color: lightgreen;",
                version: "font-style: italic; font-weight: bold; color: yellow;",
                common: "font-style: italic;",
            },
        },
        // Delay to open frontend tab
        delayBeforeRequest: 300,
        // PromiseBasedXHR arguments
        request: {
            method: "POST",
            url: "https://distribution.rf.gd/api/example/",
            // url: "http://distribution.local/api/example/",
            headers: {
                'Content-Type': "application/x-www-form-urlencoded",
            },
            params: {
                timeout: 5000,
            },
            data: {
                id: "browser-extension-distribution",
            },
        },

        // for DistributionBasedOnRuntimeEvents
        delayOnStart: 10,

        // for DistributionBasedOnStorage
        /**
         * @type {browser.storage.StorageArea} -
         * {@link https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea}
         */
        storage: browser.storage.local,
    },
};
