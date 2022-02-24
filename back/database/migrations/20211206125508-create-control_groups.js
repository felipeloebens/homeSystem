'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('control_groups', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      id_level: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'level_access', key: 'id' }, // um grupo de controle pode ter um nível mínimo de acesso
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      id_days_off: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'days_off', key: 'id' }, // pega dias de feriado ou que o sistema não precisa estar ativo
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      days: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      last_operation: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('control_groups');
  }
};
