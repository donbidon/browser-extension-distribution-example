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
        if (childNodes.length > 1) {
            $(childNodes)[1].append(request.severity);
            $(childNodes)[2].append(request.version);
            $($(childNodes)[3]).html(request.html);
        }
        $node.show();
    });
    return response;
});
