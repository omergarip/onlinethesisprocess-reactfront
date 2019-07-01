export const create = (userId, token, form) => {
    return window.fetch(`https://onlinethesisprocess-omergarip.c9users.io/user/${userId}/new-form`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err))
}