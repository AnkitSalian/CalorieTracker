const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc     Add Food
// @route    POST /api/v1/food/add
// @access   private
exports.addFood = asyncHandler(async (req, res, next) => {
    const { date, whichFood, calorie, email, id } = req.body;

    if ((!date || date === null || date === '') || (!whichFood || whichFood === null || whichFood === '') || (!calorie || calorie === null || calorie === 0) || (!id || id === null || id === '')) {
        return next(new ErrorResponse('Please provide date, food, calorie and id', 400));
    }

    try {
        // Fetch user
        const user = fs.readFileSync(__dirname + "/../data/user.json");
        const userData = JSON.parse(user);

        // Add new instance of food
        let foodObj = {
            id, date, whichFood, calorie, utcDate: new Date(date)
        };
        userData[email].food.push(foodObj);

        let uniqueDate = await calorieTracker(userData[email]);

        fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(userData), (err) => {
            if (err) {
                return next(new ErrorResponse('Something went wrong', 500));
            } else {

                res.status(200).json({
                    success: true,
                    data: userData[email].food,
                    calorieTracker: uniqueDate
                })
            }

        })

    } catch (error) {
        return next(new ErrorResponse('Something went wrong', 500));
    }
})

// @desc     Update Food
// @route    PATCH /api/v1/food/update/:id
// @access   private
exports.updateFood = asyncHandler(async (req, res, next) => {
    const { email, date, whichFood, calorie } = req.body;
    const { foodId } = req.params;

    try {
        // Fetch user
        const user = fs.readFileSync(__dirname + "/../data/user.json");
        const userData = JSON.parse(user);

        let foodObj = userData[email].food.filter(food => food.id === foodId);

        if (foodObj.length === 0) {
            return next(new ErrorResponse(`${foodId} dont exist`, 400));
        }

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

        let uniqueDate = await calorieTracker(userData[email]);

        fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(userData), (err) => {
            if (err) {
                return next(new ErrorResponse('Something went wrong', 500));
            } else {

                res.status(200).json({
                    success: true,
                    data: userData[email].food,
                    calorieTracker: uniqueDate
                })
            }

        })

    } catch (error) {
        console.log(error);
        return next(new ErrorResponse('Something went wrong', 500));
    }

})

// @desc     Delete Food
// @route    DELETE /api/v1/food/delete/:id
// @access   private
exports.deleteFood = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const { foodId } = req.params;

    try {
        // Fetch user
        const user = fs.readFileSync(__dirname + "/../data/user.json");
        const userData = JSON.parse(user);

        let foodObj = userData[email].food.filter(food => food.id === foodId);

        if (foodObj.length === 0) {
            return next(new ErrorResponse(`${foodId} dont exist`, 400));
        }

        let foodArray = userData[email].food.filter(food => food.id !== foodId);

        userData[email].food = foodArray;

        let uniqueDate = await calorieTracker(userData[email]);

        fs.writeFile(__dirname + "/../data/user.json", JSON.stringify(userData), (err) => {
            if (err) {
                return next(new ErrorResponse('Something went wrong', 500));
            } else {

                res.status(200).json({
                    success: true,
                    data: userData[email].food,
                    calorieTracker: uniqueDate
                })
            }

        })

    } catch (error) {
        return next(new ErrorResponse('Something went wrong', 500));
    }
})

// @desc     Fetch Food
// @route    Get /api/v1/food
// @access   private
exports.fetchFood = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    try {
        // Fetch user
        const user = fs.readFileSync(__dirname + "/../data/user.json");
        const userData = JSON.parse(user);

        let uniqueDate = await calorieTracker(userData[email]);

        res.status(200).json({
            success: true,
            data: userData[email].food,
            calorieTracker: uniqueDate
        })
    } catch (error) {
        return next(new ErrorResponse('Something went wrong', 500));
    }
})

const calorieTracker = asyncHandler(async (userData) => {
    let uniqueDate = {};
    for (let i = 0; i < userData.food.length; i++) {
        if (!Object.keys(uniqueDate).includes(userData.food[i].date)) {
            uniqueDate[userData.food[i].date] = await 0;
        }
        uniqueDate[userData.food[i].date] += await userData.food[i].calorie;
    }
    return uniqueDate
})