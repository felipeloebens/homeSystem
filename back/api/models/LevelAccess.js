module.exports = (sequelize, DataTypes) => {
  const LevelAccess = sequelize.define("level_access", {

    description: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  }, {tableName: 'level_access'});

  LevelAccess.associate = (models) => {
    LevelAccess.hasMany(models.users, { foreignKey: 'id', targetKey: 'id_level' }) // 1 level pode ter N usuários, 1:N
    LevelAccess.hasMany(models.control_groups, { foreignKey: 'id', targetKey: 'id_level' }) // 1 level pode ter N usuários, 1:N
  };

  return LevelAccess;
} 