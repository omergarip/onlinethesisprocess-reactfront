export const getReviewByUser = (userId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/review/${userId}`, {
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

export const create = (userId, token, review) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/new-review`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(review)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const update = (userId, token, reviewId, review) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/review/${reviewId}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(review)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};