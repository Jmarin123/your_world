import axios from 'axios'
axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
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
