var settings = new Store("settings", {
  "mode": 'default'
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.from == "inject" && request.subject == 'settings')
      	sendResponse({data: settings.toObject()});
    else
    	sendResponse({});
});
