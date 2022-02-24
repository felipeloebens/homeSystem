const express = require('express');
const LevelAccessController =  require('../controllers/LevelAccessController.js');

const routes = express.Router();

routes.get('/', (req, res) => LevelAccessController.list(req, res));
routes.post('/', (req, res) => LevelAccessController.create(req, res));
routes.put('/:id', (req, res) => LevelAccessController.update(req, res));
routes.delete('/:id', (req, res) => LevelAccessController.delete(req, res));

module.exports = routes;