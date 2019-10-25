export const getProcessByUserId = (userId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/user/${userId}`, {
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

export const getProcess = (pId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}`, {
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

export const createProcess = (userId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/new/${userId}`, {
			method: 'POST',
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

export const updateProcess = (pId, rId, token) => {
	return window.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/research/${rId}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const updateAdviser = (pId, userId, token) => {
	return window.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/adviser/${userId}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				Authorization: `Bearer ${token}`
			},
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const updateForm = (pId, formId, token) => {
	return window.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/thesis-form/${formId}`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		},
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err));
};

export const updateIntroduction = (pId, introductionId, token) => {
	return window.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/introduction/${introductionId}`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		},
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err));
};

export const updateReview = (pId, reviewId, token) => {
	return window.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/literature-review/${reviewId}`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		},
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err));
};

export const updateMethodology = (pId, metId, token) => {
	return window.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/methodology/${metId}`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		},
	})
	.then(response => {
		return response.json();
	})
	.catch(err => console.log(err));
};