var express = require('express');
var router = express.Router();


const materiaController = require('../controllers/MateriaController.js');

router.put('/:id', materiaController.updateMateria);
router.delete('/:id', materiaController.deleteMateria);
router.get('/:id', materiaController.getAllMateria);
router.get('/get/:id', materiaController.getMateria);
router.post('/', materiaController.createMateria);

module.exports = router;