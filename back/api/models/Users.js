
const bcrypt = require("bcrypt");

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

  Users.beforeCreate(async (user, options) => {
    user.pass = await bcrypt.hash(user.pass, await bcrypt.genSalt(10));
  });

  Users.associate = (models) => {
    Users.belongsTo(models.level_access, { targetKey: 'id', foreignKey: 'id_level'});
  };

  return Users;
} 