export const create = (pId, token, form) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/form`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(form)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const getForm = (userId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/form/user/${userId}`, {
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