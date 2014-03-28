/* Update the relevant fields with the new data */
function dispKeys(accessKeyMap) {
    if(accessKeyMap.length > 0) {

        var shortcut = document.getElementById("shortcuts");
        var no_access = document.getElementById("no-access");
        no_access.parentNode.removeChild(no_access);

        for(var i = 0; i<accessKeyMap.length; i++) {
            var node = document.createElement('tr');
            node.innerHTML = '<td>'+ accessKeyMap[i].label +'</td><td>'+accessKeyMap[i].key+'</td>';
            shortcut.appendChild(node);
        }
    }
}

/* Once the DOM is ready... */
window.addEventListener("DOMContentLoaded", function() {
    /* ...query for the active tab... */
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function(tabs) {
        /* ...and send a request for the DOM info... */
        chrome.tabs.sendMessage(
            tabs[0].id,
            { from: "popup", subject: "listKeys" },
            /* ...also specifying a callback to be called 
             *    from the receiving end (content script) */
            dispKeys);
    });
});