export const facultySignup = user => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/signup/faculty`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const studentSignup = user => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/signup/student`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const signin = user => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/signin`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const authenticate = (jwt, next) => {
	if (typeof window !== 'undefined') {
		window.localStorage.setItem('jwt', JSON.stringify(jwt));
		next();
	}
};

export const signout = next => {
	if (typeof window !== 'undefined') window.localStorage.removeItem('jwt');
	next();
	return window
		.fetch('${process.env.REACT_APP_API_URL}/signout', {
			method: 'GET'
		})
		.then(response => {
			console.log('signout', response);
			return response.json();
		})
		.catch(err => console.log(err));
};

export const isAuthenticated = () => {
	if (typeof window === 'undefined') return false;

	if (window.localStorage.getItem('jwt')) return JSON.parse(window.localStorage.getItem('jwt'));
	else return false;
};