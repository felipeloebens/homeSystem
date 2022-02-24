const express = require('express');
const ModbusController =  require('../controllers/ModbusController.js');

const routes = express.Router();

routes.get('/', (req, res) => res.json({me: "invalid route, does not read registers!"}));
routes.post('/', (req, res) => res.json({me: "invalid route, does not write registers!"}));
routes.get('/readHoldingRegFC3', (req, res) => ModbusController.readHoldingRegFC3(req, res));
routes.post('/writeHoldingRegFC16', (req, res) => ModbusController.writeHoldingRegFC16(req, res));
routes.post('/writeHoldingRegFC6', (req, res) => ModbusController.writeHoldingRegFC6(req, res));

module.exports = routes;