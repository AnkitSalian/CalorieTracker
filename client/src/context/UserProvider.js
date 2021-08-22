import React, { useState } from 'react';
import UserContext from './user-context';

const UserProvider = (props) => {

    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');

    const userContext = {
        userName,
        email,
        token,
        setUserName,
        setEmail,
        setToken
    };

    return (
        <UserContext.Provider value={userContext}>
            {props.children}
        </UserContext.Provider>
    )
}

export default UserProvider
