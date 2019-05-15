


chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {

  if (msg.action == 'open_dialog_box') {
    var s = document.createElement('script');
    s.src = chrome.extension.getURL('js/inject.js');
    s.onload = function() {
        this.parentNode.removeChild(this);
    };
    (document.head || document.documentElement).appendChild(s);
  }
});
