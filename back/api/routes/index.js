const express = require('express');
const modbusRoutes =  require('./modbusRoutes')
const masterRoutes =  require('./masterRoutes')
const circuitRoutes =  require('./circuitRoutes')
const usersRoutes =  require('./usersRoutes')
const circuitTypesRoutes =  require('./circuitTypesRoutes')
const controlGroupsRoutes =  require('./controlGroupsRoutes')
const levelAccessRoutes =  require('./levelAccessRoutes')
const daysOffRoutes =  require('./daysOffRoutes')


const routes = express.Router();

routes.use('/modbus', modbusRoutes);
routes.use('/masters', masterRoutes);
routes.use('/circuits', circuitRoutes);
routes.use('/users', usersRoutes);
routes.use('/cicuitTypes', circuitTypesRoutes);
routes.use('/controlGroups', controlGroupsRoutes);
routes.use('/levelAccess', levelAccessRoutes);
routes.use('/daysOff', daysOffRoutes);



module.exports = routes;