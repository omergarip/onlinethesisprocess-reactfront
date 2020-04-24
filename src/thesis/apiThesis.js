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

export const getThesisByProcessId = (pId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/thesis`, {
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

export const getThesisByAdviserId = (userId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/thesis`, {
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

export const getThesis = (thesisId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis/${thesisId}`, {
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

export const getThesisByChapterId = (chapterId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/chapter/${chapterId}`, {
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

export const createThesis = (pId, token, thesis) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis-process/${pId}/thesis`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(thesis)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const createChapter = (thesisId, token, chapters, references) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis/${thesisId}`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ chapters, thesisId, references })
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

export const updateThesis = (thesisId, token, thesis) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis/${thesisId}`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(thesis)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};

export const updateChapter = (thesisId, token, chapters, chapterId, references) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/thesis/${thesisId}/chapter`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ chapters, thesisId, chapterId, references })
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
};