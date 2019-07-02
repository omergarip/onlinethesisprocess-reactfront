export const create = (userId, token, research) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/research/new/${userId}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(research)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const list = () => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/researches`, {
			method: 'GET'
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const getResearch = (researchId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/research/${researchId}`, {
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