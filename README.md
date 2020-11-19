# Self-distributed Google Chrome/Mozilla Firefox browsers extension

If you
* cannot give public access to your extension,
* don't wanna pay Google to publish and distribute your Chrome browser
extensions in 
[web store](https://chrome.google.com/webstore/category/extensions),
* wanna to track installing/updating or starting your extension or
something else,

you can use this example extension as basis with your modifications.

Every time you install/update extension or open browser having
already installed this extension, it sends request to remote
service and receives information about updates. In current
implementation it supports trivial/major/critical severity, you can
change it as you wish. 

## Usage

* Open [test panel](https://distribution.rf.gd/api/1.0/test/panel.php),
setup severity, version and HTML code that remote service will return 
to this extension;
* Open chrome://extensions/ in new tab, turn on developer mode and load
unpacked extension from "extension" folder, explore background page
console;
* You can set up own remote service based on simple example from "www"
folder;
* Modify "extension/core/config.js", "extension/core/background.js" and
"frontend/*" according to your needs.

### Update dependencies
* Install [node.js](https://nodejs.org/en/download/);
* Install [Yarn package manager](https://yarnpkg.com/getting-started/install);
* In CLI go to "extension" folder and run: `yarn upgrade`.

### Donate
[YooMoney (ex-Yandex.Money), Visa, MasterCard, Maestro](https://https://yoomoney.ru/to/41001351141494).

[![Donate to liberapay](http://img.shields.io/liberapay/receives/don.bidon.svg?logo=liberapay)](https://liberapay.com/don.bidon/donate)

### Contacts
Telegram: [@don_b_don](https://t.me/don_b_don).
