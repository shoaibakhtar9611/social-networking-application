export const get_user = (userId, token) => {
    return fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const update_user = (userId, token, user) => {
    // console.log('USER DATA FOR UPDATE: ', user);
    return fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: user
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const list_users = () => {
    return fetch(`http://localhost:8080/api/users`, {
        method: "GET",
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const remove_user = (userId,token) => {
    return fetch(`http://localhost:8080/api/users/${userId}`, {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const updatedUser = (user, next) => {
    if(typeof window !== 'undefined') {
        if(localStorage.getItem('jwt')) {
            let auth = JSON.parse(localStorage.getItem('jwt'));
            // console.log(auth);
            auth.data.user = user;
            localStorage.setItem('jwt', JSON.stringify(auth));
            next();
        }
    }
};

export const get_user_photo = (userId) => {
    return fetch(`http://localhost:8080/api/users/photo/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        }
    })
    .then(response => {
        return response.json();
    }) 
    .catch(err => {
        console.log(err);
    });

};

export const follow = (userId, token, followId) => {
    // console.log('USER DATA FOR UPDATE: ', user);
    return fetch(`http://localhost:8080/api/users/follow`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, followId})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const unfollow = (userId, token, unfollowId) => {
    // console.log('USER DATA FOR UPDATE: ', user);
    return fetch(`http://localhost:8080/api/users/unfollow`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, unfollowId})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const findPeople = (userId, token) => {
    // console.log('USER DATA FOR UPDATE: ', user);
    return fetch(`http://localhost:8080/api/users/findpeople/${userId}`, {
        method: "GET",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
};