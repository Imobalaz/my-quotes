import { useCallback } from "react";
import React, { useState } from "react"


let logoutTimer;
const AuthContext = React.createContext({
    token: '',
    userIsLoggedIn: false,
    login: (token) => {},
    logout: () => {}

})

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjustedTime = new Date(expirationTime).getTime();
    const remainingTime = adjustedTime - currentTime;
    return remainingTime
}

const retrieveStoredToken = () => {
    const storedToken = localStorage.getItem('token')
    const storedExpirationDate = localStorage.getItem('expirationTime');

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    if (remainingTime <= 60000) {
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')
        return null;
    }

    return {
        token: storedToken,
        duration: remainingTime,
    }
}


export const AuthContextProvider = (props) => {
    const tokenData = retrieveStoredToken();
    let initialToken;

    if(tokenData) {
        initialToken = tokenData.token;
    }
    const [token, setToken] = useState(initialToken)

    

    const logoutHandler = useCallback(() => {
        setToken(null);
        localStorage.removeItem('token')
        localStorage.removeItem('expirationTime')

        if (logoutTimer) {
          clearTimeout(logoutTimer);
        }
    }, [])

    const loginHandler = (token, expirationTime) => {
        setToken(token);
        localStorage.setItem('token', token);
        localStorage.setItem('expirationTime', expirationTime);

        const remainingTime = calculateRemainingTime(expirationTime);

        logoutTimer = setTimeout(logoutHandler, remainingTime);

    }

    const userIsLoggedIn = !!token;
    const contextValue = {
        token: token,
        userIsLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler
    }

    return <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
}

export default AuthContext;