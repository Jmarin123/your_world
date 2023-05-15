import axios from 'axios'
axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
})

export const getLoggedIn = () => api.get(`auth/loggedIn`);
export const loginUser = (email, password) => {
    return api.post(`auth/login`, {
        email: email,
        password: password
    })
}
export const logoutUser = () => api.get(`auth/logout`)
export const registerUser = (firstName, lastName, username, email, password, passwordVerify) => {
    console.log(firstName)
    return api.post(`auth/register`, {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
        passwordVerify: passwordVerify
    })
}
export const sendPasswordEmail = (email) => {
    return api.post('auth/passwordemail', {
        email: email
    })
}

export const passwordReset = (password, email, uniqueID) => {
    return api.post('auth/passwordreset', {
        password: password,
        email: email,
        uniqueID: uniqueID
    })
}
const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser,
    sendPasswordEmail,
    passwordReset,
}

export default apis
