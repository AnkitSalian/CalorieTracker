const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const helmet = require('helmet');
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

const errorHandler = require('./middleware/error');

//Load enviromnent variables
dotenv.config({ path: './config/config.env' });

//Router
const auth = require('./router/auth');
const calorie = require('./router/calorie');

const app = express();

//Body Parser
app.use(express.json());

//Developer loading middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, //10 mins
    max: 100
})

app.use(limiter);

//Prevent http param pollution
app.use(hpp());

//Enable CORS
app.use(cors());

//Mount router
app.use('/api/v1/auth', auth);
app.use('/api/v1/calorie', calorie);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

//Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    //Close servers and exit process
    server.close(() => process.exit(1));
})