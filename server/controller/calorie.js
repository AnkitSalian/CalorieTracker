const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc     Register user
// @route    POST /api/v1/calorie/add
// @access   private
exports.addFood = asyncHandler(async (req, res, next) => {
    const { date, whichFood, calorie, email } = req.body;

    if ((!date || date === null || date === '') || (!whichFood || whichFood === null || whichFood === '') || (!calorie || calorie === null || calorie === 0)) {
        return next(new ErrorResponse('Please provide date, food and calorie', 400));
    }

    try {
        // Fetch user
        const user = fs.readFileSync(__dirname + "/../data/user.json");
        const userData = JSON.parse(user);

        // Add new instance of food
        let foodObj = {
            id: uuidv4(), date, whichFood, calorie
        };
        userData[email].food.push(foodObj);

        fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(userData), (err) => {
            if (err) {
                return next(new ErrorResponse('Something went wrong', 500));
            } else {

                res.status(200).json({
                    success: true,
                    data: foodObj
                })
            }

        })

    } catch (error) {
        return next(new ErrorResponse('Something went wrong', 500));
    }
})

// @desc     Register user
// @route    POST /api/v1/calorie/update/:id
// @access   private
exports.updateFood = asyncHandler(async (req, res, next) => {
    const { email, date, whichFood, calorie } = req.body;
    const { foodId } = req.params;

    try {
        // Fetch user
        const user = fs.readFileSync(__dirname + "/../data/user.json");
        const userData = JSON.parse(user);

        let foodObj = userData[email].food.filter(food => food.id === foodId);

        if (date && date !== null && date !== '') {
            foodObj[0].date = date;
        }

        if (whichFood && whichFood !== null && whichFood !== '') {
            foodObj[0].whichFood = whichFood;
        }

        if (calorie && calorie !== null && calorie !== 0) {
            foodObj[0].calorie = calorie;
        }

        let foodArray = userData[email].food.filter(food => food.id !== foodId);
        foodArray.push(foodObj[0]);

        userData[email].food = foodArray;

        fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(userData), (err) => {
            if (err) {
                return next(new ErrorResponse('Something went wrong', 500));
            } else {

                res.status(200).json({
                    success: true,
                    data: foodObj[0]
                })
            }

        })

    } catch (error) {
        return next(new ErrorResponse('Something went wrong', 500));
    }

})


exports.deleteFood = asyncHandler(async(req, res, next) => {
    // 
})