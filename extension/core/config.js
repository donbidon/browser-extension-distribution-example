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
        onStartTimeout: 100,
        // PromiseBasedXHR arguments
        request: {
            method: "POST",
            url: "http://distribution.rf.gd/api/1.0/test/",
            // url: "http://distribution.local/api/1.0/test/", ///
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            params: {
                timeout: 5000,
            },
            data: {
                id: 'browser-extension-distribution',
            },
        },
    },
};
