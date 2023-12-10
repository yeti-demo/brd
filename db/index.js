const sequelize = require("sequelize");
const { Sequelize } = sequelize;

const db = new Sequelize({
  dialect: "sqlite",
  storage: "./db/hsc23.db",
  logging: false,
});
(async () => {
  try {
    // Sync your models with the database
    await db.sync();
    console.log("Models have been synchronized.");

    // You can now use the User model to interact with the database
    // Example: await User.create({ username: 'john_doe', email: 'john@example.com' });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();
module.exports = db;
