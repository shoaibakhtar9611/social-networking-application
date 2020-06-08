export const create_post = (userId, token, post) => {
    // console.log('USER DATA FOR UPDATE: ', user);
    return fetch(`http://localhost:8080/api/post/${userId}`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`
        },
        body: post
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const list_posts = (token) => {
    return fetch(`http://localhost:8080/api/post`, {
        method: "GET",
        headers: {
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

export const singlePost = (postId, token) => {
    return fetch(`http://localhost:8080/api/post/${postId}`, {
        method: "GET",
        headers: {
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

export const postByUser = (userId, token) => {
    return fetch(`http://localhost:8080/api/post/by/${userId}`, {
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

export const remove_post = (postId,token) => {
    return fetch(`http://localhost:8080/api/post/${postId}`, {
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

export const like_post = (userId, token, postId) => {
    return fetch(`http://localhost:8080/api/post/like`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, postId})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const unlike_post = (userId, token, postId) => {
    return fetch(`http://localhost:8080/api/post/unlike`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, postId})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const comment_post = (userId, token, postId, comment) => {
    return fetch(`http://localhost:8080/api/post/comment`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, postId, comment})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const uncomment_post = (userId, token, postId, comment) => {
    return fetch(`http://localhost:8080/api/post/uncomment`, {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({userId, postId, comment})
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
};