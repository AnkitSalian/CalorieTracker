import React, { useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import DatePicker from "react-datepicker";
import EditIcon from '@material-ui/icons/Edit';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import "react-datepicker/dist/react-datepicker.css";
import Button from '@material-ui/core/Button';
import UserContext from '../context/user-context';

import urlJson from '../util/util.json';
import axios from 'axios';

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
}))(TableRow);

const Row = (props) => {

    const { row, dateHandler, foodArray, edit, onSave, calorieTracker, onFoodChange, onCalorieChange } = props;
    const userContext = React.useContext(UserContext);

    const [editable, setEditable] = useState(edit);

    const [whichFood, setWhichFood] = useState(row.whichFood);
    const [calorie, setCalorie] = useState(row.calorie);
    const [date, setDate] = useState(typeof row.date === 'string' ? new Date(row.date) : row.date);

    const saveHandler = () => {
        onSave(row.id, dateHandler(date), whichFood, parseInt(calorie));
    }

    let checkPoint = calorieTracker[dateHandler(date)];
    let color = checkPoint === undefined ? 'green' : (checkPoint !== undefined ? (parseInt(checkPoint) <= 2000 ? 'green' : 'red') : 'red');

    const updateHandler = () => {
        let data = JSON.stringify({
            date,
            whichFood,
            calorie: parseInt(calorie)
        });

        var config = {
            method: 'patch',
            url: `${urlJson.updateFood}/${row.id}`,
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
                setEditable(false);
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

    const deleteHandler = () => {
        let data = JSON.stringify({
            date,
            whichFood,
            calorie: parseInt(calorie)
        });

        var config = {
            method: 'delete',
            url: `${urlJson.deleteFood}/${row.id}`,
            headers: {
                'Authorization': `Bearer ${userContext.token}`
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                onFoodChange(response.data.data);
                onCalorieChange(response.data.calorieTracker);
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
        <StyledTableRow>
            <StyledTableCell component="th" scope="row">
                <input type="text" value={whichFood} onChange={event => setWhichFood(event.target.value)}
                    disabled={!editable} />
            </StyledTableCell>
            <StyledTableCell align="right">
                <input type="number" value={calorie} onChange={event => setCalorie(event.target.value)}
                    disabled={!editable} style={{ color: `${color}`, borderColor: `${color}` }} />
            </StyledTableCell>
            <StyledTableCell align="right">
                <DatePicker selected={date} onChange={date => setDate(date)}
                    disabled={!editable} />
            </StyledTableCell>
            <StyledTableCell align="right">
                <EditIcon onClick={() => setEditable(prevState => !prevState)} />
                <HighlightOffIcon onClick={deleteHandler} />
            </StyledTableCell>
            <StyledTableCell align="right">
                {edit &&
                    <Button variant="contained" color="secondary" onClick={saveHandler} >
                        Save
                    </Button>
                }
                {!edit && <Button variant="contained" color="secondary" onClick={updateHandler} disabled={!editable} >
                    Update
                </Button>}


            </StyledTableCell>
        </StyledTableRow>
    )
}

export default Row;
