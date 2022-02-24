const express = require('express');
const UsersController =  require('../controllers/UsersController.js');

const routes = express.Router();

routes.get('/', (req, res) => UsersController.list(req, res));
routes.post('/', (req, res) => UsersController.create(req, res));
routes.put('/:id', (req, res) => UsersController.update(req, res));
routes.delete('/:id', (req, res) => UsersController.delete(req, res));

module.exports = routes;