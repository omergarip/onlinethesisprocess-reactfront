export const getNotifications = () => {
    return window
        .fetch(`${process.env.REACT_APP_API_URL}/get-notifications`, {
            method: 'GET'
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const getNotificationsByUser = (userId, token) => {
    return window
        .fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/notifications`, {
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

export const createNotification = (token, notification) => {
    return window
        .fetch(`${process.env.REACT_APP_API_URL}/notification/new`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(notification)
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const readNotification = (notId, token) => {
    return window
        .fetch(`${process.env.REACT_APP_API_URL}/notification/${notId}`, {
            method: 'PUT',
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

export const readAllNotification = (userId, token) => {
    return window
        .fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/notifications/read`, {
            method: 'PUT',
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

export const getReadNotificationsByUser = (userId, token) => {
    return window
        .fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/unread-notifications`, {
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

export const remove = (notId, token) => {
    return window
        .fetch(`${process.env.REACT_APP_API_URL}/notification/${notId}`, {
            method: 'DELETE',
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

export const removeByUser = (userId, token, notification) => {
    return window
        .fetch(`${process.env.REACT_APP_API_URL}/user/${userId}/notifications`, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(notification)
        })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};