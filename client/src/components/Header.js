import React from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import axios from 'axios';

import urlJson from '../util/util.json';
import UserContext from '../context/user-context';

const Header = (props) => {
    const userContext = React.useContext(UserContext);

    const logoutHandler = () => {
        let config = {
            method: 'get',
            url: urlJson.logout,
            headers: {
                'Authorization': `Bearer ${userContext.token}`
            }
        };
        axios(config)
            .then(function (response) {
                userContext.setUserName('');
                userContext.setEmail('');
                userContext.setToken('');

                props.history.push('/login');
            })
            .catch(function (error) {
                console.log('Error while logging out');
            });
    }

    return (
        <div className="header">
            <div className="flex">
                <NavLink to="/home" className="header-title" >
                    {`Welcome ${userContext.userName}`}
                </NavLink>
            </div>
            <div className="flex">
                <div className="header-button"
                    onClick={logoutHandler}
                >Logout</div>
            </div>
        </div>
    )
}

export default withRouter(Header);
