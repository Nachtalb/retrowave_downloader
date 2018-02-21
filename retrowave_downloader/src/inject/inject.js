injectScript(chrome.extension.getURL('/src/content/content.js'));
injectCSS(chrome.extension.getURL('/src/content/content.css'));


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === 'downloadCurrentPlaying') {
        window.postMessage({type: 'downloadCurrentPlaying'}, '*');
    }
});
