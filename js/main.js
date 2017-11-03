const getJSON = function(url, param) {
	return new Promise(function(resolve) {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, true);
		xhr.setRequestHeader('Content-Type', 'application/json');
		xhr.onload = function() {
			if (xhr.status === 200) {
				resolve(JSON.parse(xhr.responseText));
			}
		}
		xhr.send();
	});
}