const mysql2 = require('mysql2')

module.exports = {
  dialectModule: mysql2,
  dialect: 'mysql',
  host: 'localhost',
  username: 'root',
  password: 'root',
  database: 'homesystem',
  define: {
    timestamps: true,
    underscored: true
  }
}

// link do modelo do banco da aplicação https://app.dbdesigner.net/designer/schema/0-untitled-290116bb-96a8-4bdb-8230-b2a481e95a19