import React, { createContext, useState } from "react";
import { useNavigate } from 'react-router-dom'
import api from './auth-request-api'
// import { useContext } from "react";
// import { GlobalStoreContext } from '../store'

const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    HIDE_MODALS: "HIDE_MODALS"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        error: null,
        user: null,
        loggedIn: false,
        type: ""
    });
    console.log('AuthContext auth:', auth);
    const navigate = useNavigate();

    // useEffect(() => {
    //     auth.getLoggedIn();
    // }, []);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    error: payload.error,
                    type: payload.type,
                    user: payload.user,
                    loggedIn: payload.loggedIn
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    error: payload.error,
                    type: payload.type,
                    user: payload.user,
                    loggedIn: payload.loggedIn
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    error: null,
                    type: "",
                    user: null,
                    loggedIn: false
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    error: payload.error,
                    type: payload.type,
                    user: payload.user,
                    loggedIn: payload.loggedIn
                })
            }
            case AuthActionType.HIDE_MODALS: {
                return setAuth({
                    error: null,
                    type: "",
                    user: null,
                    loggedIn: false
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        try {
            const response = await api.getLoggedIn();
            console.log("auth.getLoggedIn");
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.GET_LOGGED_IN,
                    payload: {
                        loggedIn: response.data.loggedIn,
                        user: response.data.user,
                        error: auth.error,
                        type: "user",
                    }
                });
            }
        }
        catch {
            console.log("auth.getLoggedIn fail");
            authReducer({
                type: AuthActionType.GET_LOGGED_IN,
                payload: {
                    loggedIn: false,
                    user: null,
                    error: auth.error,
                    type: auth.type,
                }
            })
        }
    }

    auth.registerUser = async function (firstName, lastName, username, email, password, passwordVerify) {
        try {
            const response = await api.registerUser(firstName, lastName, username, email, password, passwordVerify);
            if (response.status === 200) {
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        error: null,
                        user: null,
                        loggedIn: false,
                        type: ""
                    }
                })
                navigate("/login");

            }
        } catch (response) {
            if (!response.ok) {
                console.log("response.error: " + response);
                authReducer({
                    type: AuthActionType.REGISTER_USER,
                    payload: {
                        error: response.response.data.errorMessage,
                        user: null,
                        loggedIn: false,
                        type: auth.type
                    }
                })
            }

        }

    }

    auth.loginUser = async function (email, password) {
        try {
            const response = await api.loginUser(email, password);
            if (response.status === 200) {

                authReducer({
                    type: AuthActionType.LOGIN_USER,
                    payload: {
                        error: null,
                        user: response.data.user,
                        loggedIn: true,
                        type: "user",
                    }
                })
                navigate("/yourmaps");
            }
        } catch (response) {
            // if (!response.ok) {
            console.log("response.error: " + response.response.data);
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    error: response.response.data.errorMessage,
                    user: null,
                    loggedIn: false,
                    type: auth.type,
                }
            })
        }
    }

    auth.logoutUser = async function () {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null,

            })
            // store.clearSearch();
            navigate("/");
        }
    }

    auth.getUserInitials = function () {
        let initials = "";
        if (auth.user) {
            initials += auth.user.firstName.charAt(0);
            initials += auth.user.lastName.charAt(0);
        }
        // console.log("user initials: " + initials);
        return initials;
    }

    auth.hideModals = () => {
        authReducer({
            type: AuthActionType.HIDE_MODALS,
            payload: {}
        });
    }

    //Allow a guest to view the site
    auth.continueAsGuest = function () {
        console.log("auth.continueAsGuest");
        authReducer({
            type: AuthActionType.GET_LOGGED_IN,
            payload: {
                user: null,
                loggedIn: false,
                error: null,
                type: "guest",
            }
        });
        navigate("/home");
    }

    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };