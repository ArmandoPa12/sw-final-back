var express = require('express');
var router = express.Router();


const notaController = require('../controllers/NotaController.js');

router.get('/:id', notaController.getAllNotas);
router.post('/get', notaController.getNota);
router.post('/', notaController.createNota);
router.put('/:id', notaController.updateNota);
router.delete('/:id', notaController.deleteNota);

module.exports = router;