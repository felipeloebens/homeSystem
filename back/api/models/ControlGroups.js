module.exports = (sequelize, DataTypes) => {
  const ControlGroups = sequelize.define("control_groups", {
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      days: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      last_operation: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
  });

  ControlGroups.associate = (models) => {
    ControlGroups.belongsTo(models.level_access, { targetKey: 'id', foreignKey: 'id_level'}); //nivel mínimo de userLevel 1:1
    ControlGroups.belongsTo(models.days_off, { targetKey: 'id', foreignKey: 'id_days_off'}); //nivel mínimo de userLevel 1:1
    ControlGroups.hasMany(models.circuits, { foreignKey: 'id', targetKey: 'id_group' })// o ID do grupo fica vinculado a N circuitos 1:N
  };

  return ControlGroups;
} 