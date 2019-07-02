export const check = (userId, token) => {
	return window.fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/checkProcess`, {
			method: 'GET',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			}
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const create = (userId, token, processes) => {
	return window.fetch(`${process.env.REACT_APP_API_URL}/process/new/${userId}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(processes)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};