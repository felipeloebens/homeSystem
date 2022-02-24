const express = require('express');
const ControlGroupsController =  require('../controllers/ControlGroupsController.js');

const routes = express.Router();

routes.get('/', (req, res) => ControlGroupsController.list(req, res));
routes.post('/', (req, res) => ControlGroupsController.create(req, res));
routes.put('/:id', (req, res) => ControlGroupsController.update(req, res));
routes.delete('/:id', (req, res) => ControlGroupsController.delete(req, res));

module.exports = routes;