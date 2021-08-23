import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import axios from 'axios';

import urlJson from '../util/util.json';
import UserContext from '../context/user-context';

const useStyles = makeStyles((theme) => ({
    root: {
        height: '100vh',
    },
    image: {
        backgroundImage: 'url(http://localhost:3000/food.jpg)',
        backgroundRepeat: 'no-repeat',
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    },
    paper: {
        margin: theme.spacing(8, 4),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    error: {
        color: 'red'
    },
}));

const Login = (props) => {
    const classes = useStyles();

    const userContext = React.useContext(UserContext);

    useEffect(() => {
        if (userContext.token !== '') {
            props.history.push('/home')
        }
    }, [])

    const [toggle, setToggle] = useState(true);
    const [error, setError] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const nameHandler = event => {
        setName(event.target.value)
    }

    const emailHandler = event => {
        setEmail(event.target.value);
    }

    const passwordHandler = event => {
        setPassword(event.target.value);
    }

    const toggleHandler = event => {
        setToggle(prevState => !prevState);
        setError('');
    }

    const submitHandler = event => {
        event.preventDefault();

        let data = {
            user_name: name,
            email,
            password
        };

        let config = {
            method: 'post',
            url: toggle ? urlJson.login : urlJson.register,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                (JSON.stringify(response.data));
                userContext.setUserName(response.data.userData.user_name);
                userContext.setEmail(response.data.userData.email);
                userContext.setToken(response.data.token);

                props.history.push('/home');
            })
            .catch(function (error) {
                setError(error.response.data.error);
            });

    }

    return (
        <Grid container component="main" className={classes.root}>
            <CssBaseline />
            <Grid item xs={false} sm={4} md={6} className={classes.image} />
            <Grid item xs={12} sm={8} md={6} component={Paper} elevation={6} square>
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        {toggle ? 'Sign in' : 'Register'}
                    </Typography>
                    <form className={classes.form} onSubmit={submitHandler} noValidate>
                        {!toggle && <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="name"
                            label="Name"
                            name="name"
                            autoFocus
                            onChange={nameHandler}
                            value={name}
                        />}
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            onChange={emailHandler}
                            value={email}
                        />
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            onChange={passwordHandler}
                            value={password}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            {toggle ? 'Sign In' : 'Register'}
                        </Button>
                        {error !== '' && <p className={classes.error}>{error}</p>}
                        <Grid container>
                            <Grid item xs>
                                <Link href="/forgot" variant="body2">
                                    Forgot password?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Button onClick={toggleHandler}>
                                    {toggle ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                                </Button>
                            </Grid>
                        </Grid>

                    </form>
                </div>
            </Grid>
        </Grid>
    );
}

export default Login;