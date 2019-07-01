export const getAdvisers = () => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/get-advisers`, {
        method: "GET"
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}

export const getRequestsByUser = (userId, token) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/user/${userId}/request`, {
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

export const getAdviserByStudentId = (userId, token) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/user/${userId}/adviser`, {
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

export const create = (userId, token, request) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/request/new/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(request)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}

export const accept = (requestId, token, request) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/request/${requestId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(request)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}

export const remove = (requestId, token) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/request/${requestId}`, {
        method: "DELETE",
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