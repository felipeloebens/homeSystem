const express = require('express');
const CircuitTypesController =  require('../controllers/CircuitTypesController.js');

const routes = express.Router();

routes.get('/', (req, res) => CircuitTypesController.list(req, res));
routes.post('/', (req, res) => CircuitTypesController.create(req, res));
routes.put('/:id', (req, res) => CircuitTypesController.update(req, res));
routes.delete('/:id', (req, res) => CircuitTypesController.delete(req, res));


module.exports = routes;