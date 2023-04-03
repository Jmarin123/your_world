import axios from 'axios'
axios.defaults.withCredentials = true;

let url;
if (process.env.NODE_ENV) {
    url = 'https://your-world.herokuapp.com/auth'
} else {
    url = 'http://localhost:3000/auth'
}
const api = axios.create({
    baseURL: url,
})

export const getLoggedIn = () => api.get(`/loggedIn/`);
export const loginUser = (email, password) => {
    return api.post(`/login/`, {
        email: email,
        password: password
    })
}
export const logoutUser = () => api.get(`/logout/`)
export const registerUser = (firstName, lastName, username, email, password, passwordVerify) => {
    console.log(firstName)
    return api.post(`/register/`, {
        firstName: firstName,
        lastName: lastName,
        username: username,
        email: email,
        password: password,
        passwordVerify: passwordVerify
    })
}
const apis = {
    getLoggedIn,
    registerUser,
    loginUser,
    logoutUser
}

export default apis
