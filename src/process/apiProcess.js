export const check = (userId, token) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/user/${userId}/checkProcess`, {
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

export const create = (userId, token, process) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/process/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(process)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}