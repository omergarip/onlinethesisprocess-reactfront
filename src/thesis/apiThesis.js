export const getReviewByProcessId = (pId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/literature-review`, {
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

export const getMethodologyByProcessId = (pId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/methodology`, {
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

export const getIntroductionByProcessId = (pId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/introduction`, {
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

export const getIntroduction = (introId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/introduction/${introId}`, {
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

export const create = (pId, token, introduction) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/introduction`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(introduction)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const createReview = (pId, token, review) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/literature-review`, {
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

export const createMethodology = (pId, token, methodology) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/methodology`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(methodology)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const update = (introId, token, introduction) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/introduction/${introId}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(introduction	)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const updateReview = (reviewId, token, review) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/literature-review/${reviewId}`, {
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

export const updateMethodology = (metId, token, methodology) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/methodology${metId}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(methodology)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};


export const updateIntroStatus = (introId, token, introduction) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/update-introduction/${introId}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(introduction	)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const updateReviewStatus = (reviewId, token, review) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/update-literature-review/${reviewId}`, {
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

export const updateMethodologyStatus = (metId, token, methodology) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/update-methodology/${metId}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(methodology)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};