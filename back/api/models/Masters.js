module.exports = (sequelize, DataTypes) => {
  const Masters = sequelize.define("masters", {

    ip_address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    }
  },);

  Masters.associate = (models) => {
    Masters.hasMany(models.circuits, { foreignKey: 'id', targetKey: 'id_master' }) // 1 master pode ter N circuitos, 1:N
  };

  return Masters;
} 