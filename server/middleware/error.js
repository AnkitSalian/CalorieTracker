const ErrorResponse = require('../utils/errorResponse');
//ToDo: To be customized according to the schema
const errorHandler = (err, req, res, next) => {
    let error = { ...err };

    error.message = err.message;

    //Log to console
    console.log(err);

    res.status(error.statuscode || 500).json({
        success: false,
        error: error.message || 'Server Error'
    })
}

module.exports = errorHandler;