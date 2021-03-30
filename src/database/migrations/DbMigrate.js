const db = require('../models');

class DbMigrate {
  static dropAndCreateTables() {
    db.sequelize.sync({ force: true });
  }
}

DbMigrate.dropAndCreateTables();
