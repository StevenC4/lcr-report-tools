chrome.runtime.onInstalled.addListener(function() {});

chrome.runtime.onMessage.addListener(function(message) {
	if (message.type == 'DOWNLOAD_CSV') {
		chrome.downloads.download({
			filename: message.filename,
			url: message.body
		});
	}
});
