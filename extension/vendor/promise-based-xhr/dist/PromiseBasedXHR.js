"use strict";
/**
 * Promise-based XMLHttpRequest.
 *
 * @copyright <a href="http://donbidon.rf.gd/" target="_blank">donbidon</a>
 * @license https://opensource.org/licenses/mit-license.php
 */

/**
 * Promise-based XMLHttpRequest.
 *
 * Calls resolve/reject Promise methods passing XMLHttpRequest object.
 *
 * @param {Object} args
 * - string method
 * - string url
 * - Object|string|undefined data  Data to send
 * - Object headers (optionally)
 * - Object params (optionally, XMLHttpRequest parameters, onload/onerror callbacks can't be overloaded)
 *
 * @return Promise
 */
var PromiseBasedXHR = function (args) {
    let xhr = new XMLHttpRequest();

    xhr.open(args.method, args.url);

    if (args.params) {
        Object.keys(args.params).forEach((key) => {
            xhr[key] = args.params[key];
        });
    }

    if (args.headers) {
        Object.keys(args.headers).forEach((key) => {
            xhr.setRequestHeader(key, args.headers[key]);
        });
    }

    let data = args.data;
    if (data && "object" === typeof(data)) {
        data = Object.keys(data).map((key) => {
            return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&');
    }

    return new Promise((resolve, reject) => {
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(this);
            } else {
                reject(this);
            }
        };
        xhr.onerror = function () {
            reject(this);
        };
        xhr.send(data);
    });
};
