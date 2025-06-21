var express = require('express');
var router = express.Router();

const PlanController = require('../controllers/PlanController.js');



router.post('/', PlanController.getAll);
// router.post('/create', CalendarioController.createCalendario);
router.put('/suscripcion', PlanController.updatePlan);
// router.delete('/:id', CalendarioController.deleteCalendario);





module.exports = router;