module.exports = (sequelize, DataTypes) => {
    const CircuitTypes = sequelize.define("circuit_types", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      }
    });
  
    CircuitTypes.associate = (models) => {
      CircuitTypes.hasMany(models.circuits, { foreignKey: 'id', targetKey: 'id_circuit_type' })// podem haver vários circuitos do mesmo tipo 1:N
    };
  
    return CircuitTypes;
  } 