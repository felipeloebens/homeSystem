const express = require('express');
const MasterController =  require('../controllers/MasterController.js');

const routes = express.Router();

routes.get('/', (req, res) => MasterController.list(req, res));
routes.post('/', (req, res) => MasterController.create(req, res));
routes.put('/:id', (req, res) => MasterController.update(req, res));
routes.delete('/:id', (req, res) => MasterController.delete(req, res));

module.exports = routes;