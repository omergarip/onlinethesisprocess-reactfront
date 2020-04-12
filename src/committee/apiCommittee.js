export const getCommittee = (cMemberId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/committee-members/${cMemberId}`, {
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

export const getCommitteeByStudentId = (userId, token) => {
	return window
		.fetch(`${process.env.REACT_APP_API_URL}/committee-members/${userId}`, {
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