module.exports = ({ config = {}, author = "JDM" }) => {

    const { models = "models" } = config;

	return `
// Author: ${author}
// Created on: ${new Date().toISOString()}

require("dotenv").config();
const { sequelize } = require("./${models}/models.js");

async function migrateAll() {
    try {
        console.log("🚀 Connecting to database...");
        await sequelize.authenticate();
        console.log("✅ Connection established successfully.");

        console.log("🔄 Running migrations...");
        await sequelize.sync({ force: true });
        console.log("✅ All models migrated successfully!");
    } catch (error) {
        console.error("❌ Migration failed:", error);
    } finally {
        await sequelize.close();
    }
}

migrateAll();

`;
};
