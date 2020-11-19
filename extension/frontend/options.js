browser.runtime.onMessage.addListener((request, sender) => {
    const response = Promise.resolve();
    if (browser.runtime.id !== sender.id) {
        return response;
    }
    $('div.loader').fadeOut(() => {
        $("div.global-loader").css("display", "none");
    });
    $('div.content').fadeIn(() => {
        const $node = $(`#${request.action}`), childNodes = $node.children();
        $(childNodes)[1].append(JSON.stringify(request.response, null, 2));
        if (childNodes.length > 2) {
            $(childNodes)[2].append(JSON.stringify(request.update, null, 2));
        }
        $node.show();
    });
    return response;
});
