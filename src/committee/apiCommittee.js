export const getCommittee = (committeeId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/committee-members/${committeeId}`, {
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

export const getCommitteeMembers = (token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/committee-members`, {
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

export const createCommittee = (userId, token, committee) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/new-committee`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(committee)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
}

export const selectCommittee = (committeeId, token, members) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/committee-members/${committeeId}/new-committee-member`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ members, committeeId })
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
}

export const updateCommittee = (committeeId, token, mId) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/committee-members/${committeeId}/update-committee-member`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ committeeId, mId })
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
}

export const acceptCommittee = (committeeId, token, mId, members) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/committee-members/${committeeId}/accept-committee-member`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify({ members, committeeId, mId })
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
}

export const updateDate = (committeeId, token, presentationDate) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/committee-members/${committeeId}/schedule-presentation`, {
			method: 'PUT',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`
			},
			body: JSON.stringify(presentationDate)
		})
		.then(response => {
			return response.json();
		})
		.catch(err => console.log(err));
}

export const getCommitteeByStudentId = (userId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/student/committee-members/${userId}`, {
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

export const getCommitteeByFaculty = (userId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/faculty/committee-members/${userId}`, {
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