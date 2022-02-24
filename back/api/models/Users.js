module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("users", {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      pass: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

  });

  Users.associate = (models) => {
    Users.belongsTo(models.level_access, { targetKey: 'id', foreignKey: 'id_level'});
  };

  return Users;
} 