import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

import UserContext from '../context/user-context';
import Header from './Header';
import urlJson from '../util/util.json';
import TableComponent from './Table';

const Home = (props) => {

    const userContext = React.useContext(UserContext);

    const [foodArray, setFoodArray] = useState([]);
    const [calorieTracker, setCalorieTracker] = useState({});

    const fetchFood = useCallback(
        () => {
            let config = {
                method: 'get',
                url: urlJson.fetchFood,
                headers: {
                    'Authorization': `Bearer ${userContext.token}`
                }
            };

            axios(config)
                .then(function (response) {
                    setFoodArray(response.data.data)
                    setCalorieTracker(response.data.calorieTracker);
                })
                .catch(function (error) {
                    if (error.response.status === 401) {
                        userContext.setUserName('');
                        userContext.setEmail('');
                        userContext.setToken('');
                        props.history.push('/login');
                    }
                });
        },
        [userContext.email],
    )

    useEffect(() => {

        fetchFood();

    }, [fetchFood])

    return (
        <div>
            <Header />
            {foodArray.length === 0 ? <h2>You havent entered any data, Kindly add your food</h2> : ''}
            <TableComponent food={foodArray} calorieTracker={calorieTracker} onFoodChange={setFoodArray}
                onCalorieChange={setCalorieTracker} />
        </div>
    )
}

export default Home;
