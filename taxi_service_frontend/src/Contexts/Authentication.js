import React, { useState, useEffect } from 'react';
import User from '../Models/User';

const Authentication = React.createContext({
    isLoggedIn: false,
    user: null, // Dodaj user ovde
    onLogout: () => {},
    onLogin: (user) => {},
});

export const AuthenticationProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || new User(0, '', '', '', '', '', '', '', 0, false, ''));

    useEffect(() => {
        const storedUserLoggedInInformation = localStorage.getItem('isLoggedIn');

        if (storedUserLoggedInInformation === '1') {
            setIsLoggedIn(true);
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                setUser(storedUser);
            } else {
                console.warn("Nema sačuvanog korisnika u localStorage");
                setUser(new User(0, '', '', '', '', '', '', '', 0, false, ''));
            }
        } else {
            setIsLoggedIn(false);
            setUser(new User(0, '', '', '', '', '', '', '', 0, false, ''));
        }
    }, []);

    const logoutHandler = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(new User(0, '', '', '', '', '', '', '', 0, false, ''));
    };

    const loginHandler = (user) => {
        console.log('User logged in:', user); // Dodaj proveru šta se pohranjuje
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', '1');
        setIsLoggedIn(true);
        setUser(user);
    };

    return (
        <Authentication.Provider
            value={{
                isLoggedIn: isLoggedIn,
                user: user,
                onLogout: logoutHandler,
                onLogin: loginHandler,
            }}
        >
            {props.children}
        </Authentication.Provider>
    );
};

export default Authentication;
