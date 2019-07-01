export const read = (userId, token) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/user/${userId}`, {
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
    
export const update = (userId, token, user) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/user/${userId}`, {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: user
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}
    
export const remove = (userId, token) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/user/${userId}`, {
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

export const list = () => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/users`, {
        method: "GET"
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}
    
export const listFaculty = () => {
    return window.fetch(`https://34e4d126bed8420f8e0636205fc3eaa2.vfs.cloud9.us-east-1.amazonaws.com:8081/faculty-members`, {
        method: "GET"
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}
    
export const updateUser = (user, next) => {
    if(typeof window !== 'undefined') {
        if(window.localStorage.getItem('jwt')) {
            let auth =JSON.parse(window.localStorage.getItem('jwt'))
            auth.user = user
            window.localStorage.setItem('jwt', JSON.stringify(auth))
            next()
        }
    }
}