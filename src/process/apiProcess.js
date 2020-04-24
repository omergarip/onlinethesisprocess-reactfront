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

export const createProcess = (studentId, token, process) => {
	return window
		.fetch(`http://localhost:3001/thesis-process/new/${studentId}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(process)
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


export const updateThesisId = (pId, thesisId, token) => {
	return window.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/thesis/${thesisId}`, {
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


export const updateCommitteeStatus = (pId, cId, token) => {
	return window.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/committee-members/${cId}`, {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			Authorization: `Bearer ${token}`
		}
	})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};