/* Inform the backgrund page that 
 * this tab should have a page-action */
 /*
chrome.runtime.sendMessage({
    from: "content",
    subject: "showPageAction"
});
*/

var settings = {};
var customaccessKeyMap = [];

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
        response({'access': accessKeyMap, 'custom': customaccessKeyMap});
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
		});

		//console.log(settings.website1);
		// Check for custom xKey shortcuts
		var custom1 = settings.website1;
		var domain = custom1.split('|')[0];

		customaccessKeyMap = [];
		
		if(window.document.location.host.match(domain)) {
			console.log('in2');
			var patterns = custom1.split('|')[1].split(';');
			jQuery(patterns).each(function(index) {
				var accessKey = {};
				accessKey.label = this.split('=')[0];
				var rgx = this.split('=')[1];
				console.log(rgx);
				accessKey.rgx = rgx;
				if(jQuery(rgx).length) {
					accessKey.key = jQuery(rgx)[0].textContent;	
					customaccessKeyMap.push(accessKey);
				}
			});

			console.log(customaccessKeyMap);
			for(var i =0; i < customaccessKeyMap.length; i++) {
				console.log('Binding event for ' + customaccessKeyMap[i].label);
				$(document).bind('keydown', customaccessKeyMap[i].label, function(e) {
					console.log(e.data.keys);
					for(var i =0; i < customaccessKeyMap.length; i++) {
						console.log(customaccessKeyMap[i].label);
						if(customaccessKeyMap[i].label == e.data.keys) {
							console.log('For the bind, trigger the following ' + customaccessKeyMap[i].rgx);
							jQuery(customaccessKeyMap[i].rgx)[0].click();
						}
					}
				});
				
			}
		}
	}
}, 10);