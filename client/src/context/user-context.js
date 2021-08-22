import React from 'react'

const UserContext = React.createContext({
    userName: '',
    email: '',
    token: '',
    setUserName: (name) => { },
    setEmail: (email) => { },
    setToken: (token) => { }
});

export default UserContext;
