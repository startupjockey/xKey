/* Inform the backgrund page that 
 * this tab should have a page-action */
 /*
chrome.runtime.sendMessage({
    from: "content",
    subject: "showPageAction"
});
*/

var settings = {};

chrome.runtime.sendMessage({from: "inject", subject: "settings"}, function(response) {
  settings = response.data;
});

/* Listen for message from the popup */
chrome.runtime.onMessage.addListener(function(msg, sender, response) {
    /* First, validate the message's structure */
    if (msg.from && (msg.from === "popup") && msg.subject && (msg.subject === "listKeys")) {
		var accessKeyPrefix = '';
		if(settings.mode == 'default') {
			// Find the platform access key prefix
			var platform = window.navigator.platform;
			if(platform.match(/win/i)) {
				accessKeyPrefix = 'Alt + ';
			} else if (platform.match(/free/i)) {
				accessKeyPrefix = 'Alt + ';
			} else if (platform.match(/linux/i)) {
				accessKeyPrefix = 'Alt + ';
			} else if (platform.match(/mac/i)) {
				accessKeyPrefix = 'Control + Option + ';
			} else {
				accessKeyPrefix = 'Alt + ';
			}
		}

		// Get all accesskeys that are defined for a-links
		var accessKeys = document.querySelectorAll('a[accesskey]');
		accessKeyMap = [];

		for(var i=0; i<accessKeys.length; i++) {
			var accessKey = {}
			accessKey.label = accessKeyPrefix + accessKeys[i].getAttribute('accesskey');
			accessKey.key = accessKeys[i].textContent;
			accessKeyMap.push(accessKey);
		}

		/* Directly respond to the sender (popup), 
         * through the specified callback */
        response(accessKeyMap);
    }
});

var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// For each action for accesskey; define a bind event on document and an handler to trigger key press
		jQuery('a[accesskey]').each(function(index) {
			$(document).bind('keydown', this.getAttribute('accesskey'), function(e) {
				// e.data.keys - returns the actual char
				// e.keyCode - returns the keyCode (but not the acii code so we can't differentiate between lower and upper case)
				jQuery('a[accesskey='+e.data.keys+']')[0].click();
			});
		})
	}
}, 10);