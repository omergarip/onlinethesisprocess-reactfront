export const read = (userId, token) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/user/${userId}/check-student-process/`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}

export const createProcess = (userId, token, studentInfo) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/student-process/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(studentInfo)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}
