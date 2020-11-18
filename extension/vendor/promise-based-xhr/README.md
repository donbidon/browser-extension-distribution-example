[![GitHub license](https://img.shields.io/github/license/donbidon/promise-based-xhr.svg)](https://github.com/donbidon/promise-based-xhr/blob/master/LICENSE)
[![Donate to liberapay](http://img.shields.io/liberapay/receives/don.bidon.svg?logo=liberapay)](https://liberapay.com/don.bidon/donate)

# Promise-based XMLHttpRequest

## Usage
`npm i promise-based-xhr`

```javascript
let request = PromiseBasedXHR({
    "method": "GET",
    "url": "https://...",
    "data": {
        "foo": 1,
        "bar": 2,    
    },
    "headers": {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        // ...    
    },
    "params": {
        "timeout": 5000,
        "ontimeout": function () {
            console.error("Timeout");        
        },           
    },   
});
request
    .then((xhr) => {
        // Success
    })
    .catch((xhr) => {
       // Failed
    })       
    .finally(() => {
    });     
```

## Donate
[Yandex.Money, Visa, MasterCard, Maestro](https://money.yandex.ru/to/4100135114149) or click to the "receives" badge.
