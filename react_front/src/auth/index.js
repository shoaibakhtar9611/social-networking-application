export const user_SignUp = (user) => {
    return fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const user_SignIn = (user) => {
    return fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    })
    .then(res => {
        return res.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export  const authenticate = (jwt, next) => {
    if(typeof window !== "undefined") {
        localStorage.setItem("jwt", JSON.stringify(jwt));
        next();
    }
};

export const logout = (next) => {
    if(typeof window !== 'undefined') {
        localStorage.removeItem("jwt");
    }
    next();
    return fetch("http://localhost:8080/api/logout", {
        method: "GET"
    })
    .then(res => {
        console.log('logout',res);
        res.json();
    })
    .catch(err => {
        console.log(err);
    });
};

export const isAuthenticated = () => {
    if(typeof window == "undefined") {
        return false;
    }

    if(localStorage.getItem("jwt")) {
        return JSON.parse(localStorage.getItem("jwt"));
    }
    else {
        return  false;
    }
};