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
const reduceIndexed = R.addIndex(R.reduce);   //its Array.reduce method but with index as a parameter.

/*
* reduced method where if the value is false, add its index to the list
*/
const getIndexesFalse = reduceIndexed((acc, val, index) => !val ? acc.concat(index) : acc, []);

/*
* reduced method where if the value is true, add its index to the list
*/
const getIndexesTrue = reduceIndexed((acc, val, index) => val ? acc.concat(index) : acc, []);

//DOM functions
const setProp = R.curry(function(prop, value, elm) {
	elm[prop] = value;
	return elm;
});

const classList = R.curry(function(method, value, elm) {
	elm.classList[method](value);
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
							<div class="animate-flip">
							<div class="modal">
								<div class="modal-top">
									<img class="exit" src="img/exit.svg" alt="Exit">
									<img class="portrait">
									<div class="nav">
										<img class="arrow" src="img/left.svg" alt="Left Arrow">
										<h3 class="name"></h3>
										<img class="arrow" src="img/left.svg" alt="Right Arrow">
									</div>
									<span class="email"></span>
									<span class="location"></span>
								</div>
								<div class="modal-bottom">
									<p class="address-info"></p>
									<p class="address-info"></p>
									<p class="address-info"></p>
								</div>
							</div>
							</div>
						 </div>`;

const searchBarHTMLString = `<div class="search-wrapper">
								<label class="label-search" for="search">Seacrh Employee: </label>
								<input type="text" id="search">
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

const defaultAllEmployees = parent => () =>
R.pipe(
	R.filter(R.pathEq(['style', 'display'], 'none')),
	R.forEach(R.pipe(R.prop('style'), setProp('display', ''))),
	R.forEach(classList('remove', 'filtered'))
)(parent.children);

						 
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

const delay = function(time) {
	return function(value) {
		return new Promise(function(resolve) {
			setTimeout(function(value) {
				resolve(value);
			}, time, value);
		});
	}
}

const debounce = function(fn, time) {
	let timeoutId;
	return function() {
		const args = [fn, time].concat(Array.from(arguments));
		clearTimeout(timeoutId);
		timeoutId = window.setTimeout.apply(window, args); //proxy the arguments to the setTimeout() method
	}
}

//Check functions
const checkRange = length => index => 
index < 0 ? length - 1 :
index === length ? 0 :
index;

const includes = str1 => str2 => str2.includes(str1);

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

//Elements
const employeesList = document.getElementById('employees');
const content = document.getElementById('content');

employeesList.insertAdjacentHTML('beforebegin', searchBarHTMLString); //creates the search bar
content.insertAdjacentHTML('afterend', modalHTMLString); //creates the modal

const searchBar = document.getElementById('search');

const overLay = document.getElementById('over-lay');
const modalFlip = overLay.querySelector('.animate-flip');
const modal = overLay.querySelector('.modal');
const modalTop = overLay.querySelector('.modal-top');
const modalBottom = overLay.querySelector('.modal-bottom');
const modalPortrait = modalTop.querySelector('.portrait');
const modalName = modalTop.querySelector('.name');
const modalEmail = modalTop.querySelector('.email');
const modalCity = modalTop.querySelector('.location');
const modalPhone = modalBottom.children[0];
const modalAddress = modalBottom.children[1];
const modalBirthday = modalBottom.children[2];
const modalNav = modalTop.querySelector('.nav');
const modalExitButton = modalTop.querySelector('.exit');
const modalLeftArrow = modalTop.querySelector('.arrow:first-child');
const modalRightArrow = modalTop.querySelector('.arrow:last-child');

const modalEffects = {
	exit: function() {
		overLay.classList.remove('perspective');
		modal.classList.remove('newspaper');
		delay(300)(null)  //allows the animation to fully perform
			.then(() => overLay.style.visibility = 'hidden');
	},
	open: function() {
		overLay.style.visibility = 'visible';
		overLay.classList.add('perspective');
		modal.classList.add('newspaper');
	},
	delayForEmployeesToChange: 250,
	delayForRemoveFlip: 250
};

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

//Modal Events
//nextEmployee has intergrated effects and cannot be put in modalEffects Obj
const nextEmployee = function(incrementOrDecrement) {
	return function(event) {
		Promise.all([employeesList.children, employees])
			.then(R.tap(() => modalFlip.classList.add('flip')))
			.then(delay(modalEffects.delayForEmployeesToChange))
			.then(([employeeElements, employees]) => {
				const filterEmployees = R.pipe(
					R.map(R.pipe(R.path(['style', 'display']), R.equals(''))),
					getIndexesTrue,
					R.map(R.nth(R.__, employees)),
					)(employeeElements);
				
				R.pipe(
					R.findIndex(R.propEq('email', modalEmail.textContent)),
					incrementOrDecrement,
					checkRange(filterEmployees.length),
					R.nth(R.__, filterEmployees),
					R.tap(updateModal)
				)(filterEmployees);
			})
			.then(delay(modalEffects.delayForRemoveFlip))
			.then(() => modalFlip.classList.remove('flip'));
	}
}

const filterEmployees = function(input) {
	const filterInput = R.pipe((R.map(R.toLower)), R.any(includes(input)));
	const getEmployee = R.pipe(
		R.nth(R.__, employeesList.children), 
		classList('add', 'filtered'),
		R.prop('style')
	);
	
	employees
		.then(R.map(R.props(['name', 'email'])))
		.then(R.map(filterInput))
		.then(getIndexesFalse)
		.then(R.map(getEmployee))
		.then(delay(300))
		.then(R.tap(test(employeesList)))
		.then(R.forEach(setProp('display', 'none')));
}
const debounceFilterEmployees = debounce(filterEmployees, 300);

employeesList.addEventListener('click', function(event) {
	const employee = R.find(R.propEq('className', 'employee'), event.path);
	if (employee) {
		const email = employee.querySelector('.email').textContent;
		employees
			.then(R.find(R.propEq('email', email)))
			.then(R.tap(updateModal))
			.then(R.tap(modalEffects.open));
	}
});

modalExitButton.addEventListener('click', function(event) {
	modalEffects.exit();
});

modalLeftArrow.addEventListener('click', nextEmployee(R.dec));
modalRightArrow.addEventListener('click', nextEmployee(R.inc));

//Search Bar Events
searchBar.addEventListener('keyup', function(event) {
	const input = event.target.value.toLowerCase();
	debounceFilterEmployees(input);
});