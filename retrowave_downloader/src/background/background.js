class RetrowaveDownloader {

    constructor() {
        const self = this;

        self.url_query = '*://*.retrowave.ru/*';

        self.update_connection();
        self.setup_listeners()
    }

    setup_listeners() {
        const self = this;

        chrome.browserAction.onClicked.addListener(function (tab) {
            self.send_download_action.call(self);
        });
        chrome.tabs.onCreated.addListener(function (tab) {
            self.update_connection.call(self);
        });
        chrome.tabs.onUpdated.addListener(function (tab) {
            self.update_connection.call(self);
        });
        chrome.tabs.onRemoved.addListener(function (tab) {
            self.update_connection.call(self);
        });
    }

    update_connection() {
        const self = this;

        chrome.tabs.query({'url': self.url_query}, function (tabs) {
            tabs.length > 0 ? self.tab = tabs[0] : self.tab = undefined;
        });
    }

    send_download_action() {
        const self = this;

        if (!self.tab) return;
        chrome.tabs.sendMessage(self.tab.id, {type: 'downloadCurrentPlaying'});
    }
}

let retrowave_downloader = new RetrowaveDownloader();
