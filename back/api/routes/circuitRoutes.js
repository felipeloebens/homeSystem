const express = require('express');
const CircuitController =  require('../controllers/CircuitController.js');

const routes = express.Router();

routes.get('/', (req, res) => CircuitController.list(req, res));
routes.post('/', (req, res) => CircuitController.create(req, res));
routes.put('/:id', (req, res) => CircuitController.update(req, res));
routes.delete('/:id', (req, res) => CircuitController.delete(req, res));

module.exports = routes;