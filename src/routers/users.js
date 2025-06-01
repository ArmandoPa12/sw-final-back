var express = require('express');
var router = express.Router();

const userController = require('../controllers/userController.js');



/* GET users listing. */
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.post('/register', userController.createUser);
router.post('/login', userController.loginUser);




module.exports = router;