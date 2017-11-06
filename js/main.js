/*
* Similar to Array.prototype.reduce but used to iterate over an Object's
* key and values
*/
if (!Object.prototype.reduce) { 
	Object.prototype.reduce = function(fn, acc) {
		for (let prop in this) {
			if (this.hasOwnProperty(prop)) {
				acc = fn(acc, this[prop], prop, this);
			}
		}
		return acc;
	}
}
/*
* Inserts another String to a position to the current String
*/
if (!String.prototype.insert) {
	String.prototype.insert = function(value, i) {
		value = typeof value === 'string' ? value : '';
		const clone = this.slice(0, this.length).split('');
		clone.splice(0, i, value)
		return clone.join('');
	}
}

const getJSON = function(url) {
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

const randomUserAPI = 'https://randomuser.me/api/?';
const params = {
	results: 12,
	format: 'json',
	exc: 'login'
}

const query = params
	.reduce((query, value, key) => [...query, `${key}=${value}`], [])
	.map(encodeURI)
	.join('&')
	.insert(randomUserAPI, 0, 0);
	
//getJSON(query)
	//.then(console.log);