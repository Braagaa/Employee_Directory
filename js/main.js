(function(R) {
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
	
	const errorElement = `<p class="error">Sorry, something went wrong! :(</p>`;
	
	const pageLoaderHTML = `<div class="page-loader">
								<div class="block1"></div>
								<div class="block2"></div>
							</div>`;
	
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
	/*
	* Updates the modal and its properties with an employee obj
	*/
	const updateModal = function({picture, name, location, nat, email, phone, dob}) {
		modalPortrait.src = picture;
		modalName.textContent = name;
		modalEmail.textContent = email;
		modalCity.textContent = location.city;
		modalPhone.textContent = phone;
		modalAddress.textContent = `${location.street}, ${nat} ${location.postcode}`;
		modalBirthday.textContent = dob;
	}

	const checkEmployeesDIV = parent => () =>
	R.pipe(
		R.filter(R.pathEq(['style', 'display'], 'none')),           //finds the employees element with its style display as none
		R.forEach(R.pipe(R.prop('style'), setProp('display', ''))), //sets their style prop as ''
		R.forEach(classList('remove', 'filtered'))                  //removes their filitered class
	)(parent.children);





	//Async functions				 
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
	/*
	* If index is -1 make the index the last item on the list.
	* If index is one more from the last item on the list, make the index 0.
	* Else return the index.
	*/
	const checkRange = length => index => 
	index < 0 ? length - 1 :
	index === length ? 0 :
	index;

	/*
	* It is String.includes(String) in function form.
	* Checks to see if str1 is already in str2.
	*/
	const includes = str1 => str2 => str2.includes(str1);

	const randomUserAPI = 'https://randomuser.me/api/?'; /*IMPORTANT*/

	//Important Objects
	/*
	* Modify the query parameter and values with the Object
	*/
	const params = {
		results: 12,
		format: 'json',
		exc: 'login'
	}

	/*
	* Transformation objects used for R.evolve.
	* Spec at http://ramdajs.com/docs/#evolve
	*/
	const transformations = {
		picture: R.prop('large'),
		name: fullName,
		location: capitalizeAllProps,
		dob: reformatDate
	}

	/*
	* The data for animations and delay number values are held
	* within this Object for organization
	*/
	const effects = {
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
		delayForRemoveFlip: 250,
		delayForEmployeeFilter: 300
	};

	/*
	* The needed props to obtain when employee objects have been received from
	* the server.
	*/
	const neededProps = ['picture', 'name', 'location', 'nat', 'email', 'phone', 'dob'];




	//Elements
	const employeesList = document.getElementById('employees');
	const content = document.getElementById('content');

	employeesList.insertAdjacentHTML('beforebegin', searchBarHTMLString); //creates the search bar
	content.insertAdjacentHTML('afterend', modalHTMLString); //creates the modal
	content.insertAdjacentHTML('beforeend', pageLoaderHTML) //runs the page-loader
	
	const pageLoader = document.querySelector('.page-loader');
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



	//Promgram
	/*
	* Takes the params Object and returns the query string needed for a 
	* request to randomUser API.
	*/
	const query = R.pipe(
		R.mapObjIndexed((val, key) => `${key}=${val}`),
		R.values,
		R.map(encodeURI),
		R.join('&'),
		prependString(randomUserAPI)
	)(params);

	const employees = getJSON(query)             //returns a Promise and waits for the response
		.then(R.prop('results'))     		     //expects an Object and returns its results prop value
		.then(R.map(R.pick(neededProps)))        //picks all the needed props from every employee Object into a new Object
		.then(R.map(R.evolve(transformations)))  //transformations the Objects to filter out Strings and such (data formats, upper or lowercase, etc)
		.then(R.tap(() => content.removeChild(pageLoader))) //removes the page-loader animation when response has been sent back
		.catch((e) => {
			console.log(e);
			content.insertAdjacentHTML('beforeend', errorElement);
			content.removeChild(pageLoader);
		})

	const employeeElements = employees
		.then(R.map(createEmployeeElement))              //makes the transformed employee Objects into HTML strings
		.then(R.join(''))                                //joins the HTML Strings to one massive HTML String
		.then(setProp('innerHTML', R.__, employeesList));//Displays it and inputs in the employeesList (ul on the DOM) with innerHTML

		
		

	//Event Handlers and Helper functions

	//Modal Events
	//nextEmployee has intergrated effects and cannot be put in effects Obj
	const nextEmployee = function(incrementOrDecrement) {
		return function(event) {
			Promise.all([employeesList.children, employees])                      //Promise is needed to implement delay effects
				.then(R.tap(() => modalFlip.classList.add('flip')))               //gives the modalFlip div the flip class
				.then(delay(effects.delayForEmployeesToChange))                   //gives a delay to allow the animation to run fully
				.then(([employeeElements, employees]) => {
					const filterEmployees = R.pipe(
						R.map(R.pipe(R.path(['style', 'display']), R.equals(''))),//if the element's display property is '' return true or else return false
						getIndexesTrue,                                           //for every value that is true return its current index in the Array
						R.map(R.nth(R.__, employees)),                            //return the correct employee Objects now that we have the correct indexes to fetch them
					)(employeeElements);                                          //inputs the employees DOM elements (the li's from the employees ul)
					
					R.pipe(
						R.findIndex(R.propEq('email', modalEmail.textContent)),   //finds the index within the filterEmployees where its email property is equal to the current email found within the modal
						incrementOrDecrement,                                     //increments or decrements the index value by 1
						checkRange(filterEmployees.length),                       //checks to see if it is within the filterEmployees length bound
						R.nth(R.__, filterEmployees),                             //retrieves the correct employee Object within the filterEmployees
						R.tap(updateModal)                                        //updates the modal to the correct employee
					)(filterEmployees);                                           //sends in the filterEmployees
				})
				.then(delay(effects.delayForRemoveFlip))                          //Adds a delay to allow animation
				.then(() => modalFlip.classList.remove('flip'));                  //removes the flip class from the modal
		}
	}

	const filterEmployees = function(input) {
		const filterInput = R.pipe((R.map(R.toLower)), R.any(includes(input)));
		const getEmployeeDIV = R.pipe(
			R.nth(R.__, employeesList.children), 
			classList('add', 'filtered'),
			R.prop('style')
		);
		
		employees                                           //employees Array
			.then(R.map(R.props(['name', 'email'])))        //gets the name and email for evey employee Object into an array [String, String]
			.then(R.map(filterInput))                       //lowercases them first and checks to see if the user input matches any of the name or emails. Returns an array of Booleans
			.then(getIndexesFalse)                          //for evey value that is false (did not match any email or name) return its current index. Returns an array of numbers representing the false indexes in the employees list
			.then(R.map(getEmployeeDIV))                    //gets the employee li from the DOM ul employees with the correct indexes, gives them the class filtered and returns its style Object
			.then(delay(effects.delayForEmployeeFilter))    //delay for animation
			.then(R.tap(checkEmployeesDIV(employeesList)))  //checks to see if any employee li needs to reappear again
			.then(R.forEach(setProp('display', 'none')));   //gives the style Object its display prop none and hides it
	}
	/*
	* Debounce is used here so when the user types, results dont automatically come up.
	* Instead a slight delay is used so that when the user finishes typing (or has stopped
	* typing after the delay) the results then show up.
	*/
	const debounceFilterEmployees = debounce(filterEmployees, effects.delayForEmployeeFilter);

	employeesList.addEventListener('click', function(event) {
		const employee = R.find(R.propEq('className', 'employee'), event.path);//finds if any of the elements that was in the event.path has a class name of employee which is the employee DIV. Returns the element or undefined
		if (employee) {
			const email = employee.querySelector('.email').textContent;
			employees
				.then(R.find(R.propEq('email', email))) //finds and retrieves the employee Object from the employees list where there email prop equals the email textContent of the selected DIV element
				.then(R.tap(updateModal))               //updates the modal with the new employee Object
				.then(R.tap(effects.open));             //applies necessary animation effects
		}
	});

	modalExitButton.addEventListener('click', function(event) {
		effects.exit();   //applies animation effects when you exit the modal
	});

	modalLeftArrow.addEventListener('click', nextEmployee(R.dec));   //curried R.dec to decrement the index when you click left on the modal
	modalRightArrow.addEventListener('click', nextEmployee(R.inc));  //curried R.inc to increment the index when you click right on the modal

	//Search Bar Events
	searchBar.addEventListener('keyup', function(event) {
		const input = event.target.value.toLowerCase();
		debounceFilterEmployees(input);
	});
})(R);