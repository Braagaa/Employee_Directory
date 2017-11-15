/*
* Takes a String and attempts to capitalize the first character
* and returns it as a new String
*/
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

/*
* Take a value and attempts to call on it's toString method
*/
const toString = val => (val).toString();

/*
* Calls .replace method on a String and uses a regExp and fun as its 
* arguments
*/
const replace = (regExp, func) => str => str.replace(regExp, func);

/*
* Used with .replace method to change the format of a date String
*/
const birthdayFormat = (match, year, month, day) => `Birthday: ${day}/${month}/${year}`;

/*
* Concatenate a string at the start of it
*/
const prependString = val => str => val + str;

//Transformation functions
const fullName = R.pipe(
	R.props(['first', 'last']), //get the values of the obj into an array
	R.map(capitalize),          //capitalize the first letter of each String in the array
	R.join(' ')                 //join the array to form one String
);
const capitalizeAllProps = R.mapObjIndexed( //map through each key/value pair in the object
	R.pipe(
		toString,            //make the value into a String
		R.split(' '),        //make the String into an array for every ' ' character
		R.map(capitalize),   //capitalize the first letter of each String in the array
		R.join(' ')          //join the array to form one String
	)
);
const reformatDate = R.pipe(
	R.split(' '),                                      //make the String into an array for every ' ' character
	R.head,                                            //get the first value in the array
	replace(/(\d{4})-(\d{2})-(\d{2})/, birthdayFormat) //replace the String
);

//DOM functions
const setProp = R.curry(function(prop, value, elm) {
	elm[prop] = value;
	return elm;
});

const createEmployeeElement = function({picture, name, location, nat, email, phone, dob}) {
	return `<li class="animate-lift">
		        <div class="employee">
					<img src="${picture}">
					<div class="info">
						<h3 class="name">${name}</h3>
						<span class="email">${email}</span>
						<span class="location">${location.city}</span>
					</div>
				</div>
	        </li>`;
}

const modalHTMLString = `<div id="over-lay">
						    <div class="modal">
								<div class="modal-top">
									<img class="exit" src="img/exit.svg">
									<img class="portrait">
									<h3 class="name"></h3>
									<span class="email"></span>
									<span class="location"></span>
								</div>
								<div class="modal-bottom">
									<p class="address-info"></p>
									<p class="address-info"></p>
									<p class="address-info"></p>
								</div>
							</div>
						 </div>`;

const updateModal = function({picture, name, location, nat, email, phone, dob}) {
	modalPortrait.src = picture;
	modalName.textContent = name;
	modalEmail.textContent = email;
	modalCity.textContent = location.city;
	modalPhone.textContent = phone;
	modalAddress.textContent = `${location.street}, ${nat} ${location.postcode}`;
	modalBirthday.textContent = dob;
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
const transformations = {
	picture: R.prop('large'),
	name: fullName,
	location: capitalizeAllProps,
	dob: reformatDate
}
const neededProps = ['picture', 'name', 'location', 'nat', 'email', 'phone', 'dob'];

const employeesList = document.getElementById('employees');
const content = document.getElementById('content');

content.insertAdjacentHTML('afterend', modalHTMLString); //creates the modal

const overLay = document.getElementById('over-lay');
const modalTop = overLay.querySelector('.modal-top');
const modalBottom = overLay.querySelector('.modal-bottom');
const modalPortrait = modalTop.querySelector('.portrait');
const modalName = modalTop.querySelector('.name');
const modalEmail = modalTop.querySelector('.email');
const modalCity = modalTop.querySelector('.location');
const modalPhone = modalBottom.children[0];
const modalAddress = modalBottom.children[1];
const modalBirthday = modalBottom.children[2];

const query = R.pipe(
	R.mapObjIndexed((val, key) => `${key}=${val}`),
	R.values,
	R.map(encodeURI),
	R.join('&'),
	prependString(randomUserAPI)
)(params);

const employees = getJSON(query)
	.then(obj => obj.results)
	.then(R.map(R.pick(neededProps)))
	.then(R.map(R.evolve(transformations)));
	
const employeeElements = employees
	.then(R.map(createEmployeeElement))
	.then(R.join(''))
	.then(setProp('innerHTML', R.__, employeesList))//side-effects

//Event Handlers

employeesList.addEventListener('click',function(event) {
	const employee = R.find(R.propEq('className', 'employee'), event.path);
	if (employee) {
		const email = employee.querySelector('.email').textContent;
		employees
			.then(R.find(R.propEq('email', email)))
			.then(updateModal)
			.then(() => overLay.style.visibility = 'visible')
	}
});