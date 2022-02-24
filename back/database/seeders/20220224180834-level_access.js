'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('level_access', [{
      description: 'Admin'
    },{
      description: 'Monitor'
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('level_access', null, {});
  }
};
