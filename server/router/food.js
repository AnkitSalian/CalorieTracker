const express = require('express');

const router = express.Router();

const { protect } = require('../middleware/auth');
const { addFood, updateFood, deleteFood, fetchFood } = require('../controller/food');

router.post('/add', protect, addFood);

router.patch('/update/:foodId', protect, updateFood);

router.delete('/delete/:foodId', protect, deleteFood);

router.get('/', protect, fetchFood);

module.exports = router;