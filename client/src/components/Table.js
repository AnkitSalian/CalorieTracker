import React, { useState } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Row from './Row';
import { TableBody } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

import urlJson from '../util/util.json';
import UserContext from '../context/user-context';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

function createData(date, whichFood, calorie, id) {
    return { date, whichFood, calorie, id, utcDate: date };
}


const useStyles = makeStyles({
    table: {
        minWidth: 700,
    },
});

export default function CustomizedTables(props) {
    const classes = useStyles();

    const { food, calorieTracker, onFoodChange, onCalorieChange } = props;
    const userContext = React.useContext(UserContext);

    const [toggleButton, setToggleButton] = useState(false);

    const formatDate = (date) => {
        var month = (date.getMonth() + 1).toString().length === 1 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        var day = (date.getDate()).toString().length === 1 ? `0${date.getDate()}` : date.getDate();
        var year = (date.getFullYear());
        return year + "-" + month + "-" + day;
    }

    const dateHandler = date => {
        return formatDate(date);
    }

    const addRow = () => {
        onFoodChange(prevState => {
            return [...prevState, createData((new Date()), '', 0, uuidv4())]
        })
        setToggleButton(prevState => !prevState)
    }

    const onSave = (id, date, whichFood, calorie) => {
        // setToggleButton(prevState => !prevState)
        console.log(id, date, whichFood, calorie);

        let data = JSON.stringify({
            date,
            whichFood,
            calorie,
            id
        });

        var config = {
            method: 'post',
            url: urlJson.addFood,
            headers: {
                'Authorization': `Bearer ${userContext.token}`,
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                onFoodChange(response.data.data);
                onCalorieChange(response.data.calorieTracker);
                setToggleButton(prevState => !prevState);
            })
            .catch(function (error) {
                if (error.response.status === 401) {
                    userContext.setUserName('');
                    userContext.setEmail('');
                    userContext.setToken('');
                    props.history.push('/login');
                }
            });
    }

    return (
        <>

            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Food</StyledTableCell>
                            <StyledTableCell align="right">Calories</StyledTableCell>
                            <StyledTableCell align="right">Date</StyledTableCell>
                            <StyledTableCell align="right">Action</StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {food.map((row) => (
                            <Row key={row.id} row={row} dateHandler={dateHandler} food={food}
                                edit={row.whichFood === ''} onSave={onSave} calorieTracker={calorieTracker}
                                onFoodChange={onFoodChange} onCalorieChange={onCalorieChange} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div style={{ marginTop: '5px' }}>
                <Button variant="contained" color="primary" onClick={addRow} style={{ marginRight: '5px', marginLeft: '5px' }} disabled={toggleButton} >
                    Add
                </Button>

            </div>
        </>
    );
}
