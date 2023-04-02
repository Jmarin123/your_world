import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom'
import api from './auth-request-api'
import { Outlet } from 'react-router-dom'

const AuthContext = createContext();
console.log("create AuthContext");

export const AuthActionType = {
    GET_LOGGED_IN: "GET_LOGGED_IN",
    LOGIN_USER: "LOGIN_USER",
    LOGOUT_USER: "LOGOUT_USER",
    REGISTER_USER: "REGISTER_USER",
    REGISTER_USER_ERROR: "REGISTER_USER_ERROR"
}

function AuthContextProvider(props) {
    const [auth, setAuth] = useState({
        user: null,
        loggedIn: false,
        errorMessage: null
    });
    const navigate = useNavigate();

    useEffect(() => {
        auth.getLoggedIn();
    }, [auth]);

    const authReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            case AuthActionType.GET_LOGGED_IN: {
                return setAuth({
                    user: payload.user,
                    loggedIn: payload.loggedIn,
                    errorMessage: null
                });
            }
            case AuthActionType.LOGIN_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: null
                })
            }
            case AuthActionType.LOGOUT_USER: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: null
                })
            }
            case AuthActionType.REGISTER_USER: {
                return setAuth({
                    user: payload.user,
                    loggedIn: true,
                    errorMessage: null
                })
            }
            case AuthActionType.REGISTER_USER_ERROR: {
                return setAuth({
                    user: null,
                    loggedIn: false,
                    errorMessage: payload.errorMessage
                })
            }
            default:
                return auth;
        }
    }

    auth.getLoggedIn = async function () {
        const response = await api.getLoggedIn();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.SET_LOGGED_IN,
                payload: {
                    loggedIn: response.data.loggedIn,
                    user: response.data.user
                }
            });
        }
    }

    auth.registerUser = async function (firstName, lastName, username, email, password, passwordVerify) {
        console.log("First name here")
        console.log(firstName)
        const response = await api.registerUser(firstName, lastName, username, email, password, passwordVerify).catch(function (error) {

            authReducer({
                type: AuthActionType.REGISTER_USER_ERROR,
                payload: {
                    errorMessage: error.response.data.errorMessage
                }
            })
        });
        if (response && response.status === 200) {
            authReducer({
                type: AuthActionType.REGISTER_USER,
                payload: {
                    user: response.data.user
                }
            })
            //const resp = 
            await auth.loginUser(email, password);
        }
    }

    auth.loginUser = async function (email, password) {
        const response = await api.loginUser(email, password).catch(function (error) {
            authReducer({
                type: AuthActionType.REGISTER_USER_ERROR,
                payload: {
                    errorMessage: error.response.data.errorMessage
                }
            })
        });
        if (response && response.status === 200) {
            authReducer({
                type: AuthActionType.LOGIN_USER,
                payload: {
                    user: response.data.user
                }
            })
            console.log("Logged in")
            navigate("/home");
        }
    }

    auth.logoutUser = async function () {
        const response = await api.logoutUser();
        if (response.status === 200) {
            authReducer({
                type: AuthActionType.LOGOUT_USER,
                payload: null
            })
            navigate("/");
        }
    }

    // auth.getUserInitials = function() {
    //     let initials = "";
    //     if (auth.user) {
    //         initials += auth.user.firstName.charAt(0);
    //         initials += auth.user.lastName.charAt(0);
    //     }
    //     console.log("user initials: " + initials);
    //     return initials;
    // }

    auth.resolveErrorMessage = function () {
        authReducer({
            type: AuthActionType.REGISTER_USER_ERROR,
            payload: {
                errorMessage: null
            }
        })
    }


    return (
        <AuthContext.Provider value={{
            auth
        }}>
            {props.children}
            <Outlet />
        </AuthContext.Provider>
    );
}

export default AuthContext;
export { AuthContextProvider };