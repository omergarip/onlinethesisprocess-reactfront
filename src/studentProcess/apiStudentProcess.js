export const read = (userId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/check-student-process/`, {
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

export const createProcess = (userId, token, studentInfo) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/student-process/new/${userId}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(studentInfo)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const updateProcess = (userId, token, pId,data) => {
	return window.fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/student-process/${pId}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(data)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

