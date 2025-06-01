var express = require('express');
var router = express.Router();

const CalendarioController = require('../controllers/CalendarioController.js');


router.post('/', CalendarioController.getAllDates);
router.post('/create', CalendarioController.createCalendario);
router.put('/:id', CalendarioController.updateCalendario);
router.delete('/:id', CalendarioController.deleteCalendario);





module.exports = router;