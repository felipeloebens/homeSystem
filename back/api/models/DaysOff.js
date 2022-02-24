module.exports = (sequelize, DataTypes) => {
  const LevelAccess = sequelize.define("days_off", {

    date: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
    }
  }, {tableName: 'days_off'});

  LevelAccess.associate = (models) => {
    LevelAccess.hasMany(models.control_groups, { foreignKey: 'id', targetKey: 'id_days_off' }) // 1 level pode ter N usuários, 1:N
  };

  return LevelAccess;
} 