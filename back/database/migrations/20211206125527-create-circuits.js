'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('circuits', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      id_master: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'masters', key: 'id' }, // cada circuito possui 1 master, ou seja 1:1
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'circuit_types', key: 'id' }, // cada circuito possui um tipo, ou seja 1:1
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_group: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'control_groups', key: 'id' }, // cada circuito pode estar em N grupos 1:N
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'  
      },
      register_com: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      register_state: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      state: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('circuits');
  }
};
