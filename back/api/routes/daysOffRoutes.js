const express = require('express');
const DaysOffController =  require('../controllers/DaysOffController.js');

const routes = express.Router();

routes.get('/', (req, res) => DaysOffController.list(req, res));
routes.post('/', (req, res) => DaysOffController.create(req, res));
routes.put('/:id', (req, res) => DaysOffController.update(req, res));
routes.delete('/:id', (req, res) => DaysOffController.delete(req, res));


module.exports = routes;