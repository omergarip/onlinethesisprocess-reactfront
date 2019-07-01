export const getPermissions = (userId) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/permissions/${userId}`, {
        method: "GET"
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}

export const getPermissionsByUser = (userId, token) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/user/${userId}/permission`, {
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

export const create = (researchId, token, permission) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/permission/new/${researchId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(permission)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}

export const accept = (permissionId, token, permission) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/permission/${permissionId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(permission)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}

export const reject = (permissionId, token, permission) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/permission/${permissionId}`, {
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

export const remove = (permissionId, token) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/permission/${permissionId}`, {
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