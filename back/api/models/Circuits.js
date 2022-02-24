module.exports = (sequelize, DataTypes) => {
  const Circuits = sequelize.define("circuits", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      register_com: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      register_state: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      state: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_master: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'masters', key: 'id' }, 
      },
      id_type: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'circuit_types', key: 'id' }, 
      }
      
  });

  Circuits.associate = (models) => {
    Circuits.belongsTo(models.control_groups, { targetKey: 'id', foreignKey: 'id_group' }) // 1 master pode ter N circuitos, 1:N
    Circuits.belongsTo(models.masters, { targetKey: 'id', foreignKey: 'id_master'}); // circuito pode ter um master 1:1 
    Circuits.belongsTo(models.circuit_types, { targetKey: 'id', foreignKey: 'id_type'}); // circuito pode ter um tipo 1:1
  };

  return Circuits;
} 