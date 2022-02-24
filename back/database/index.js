const { Sequelize, DataTypes  } = require('sequelize');
const databaseConfig = require('../config/database')

const sequelize = new Sequelize(databaseConfig)

module.exports = sequelize