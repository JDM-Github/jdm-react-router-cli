module.exports = (author = "JDM") => `
// Author: ${author}
// Created on: ${new Date().toISOString()}

require("dotenv").config();
const pg = require("pg");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
	dialect: "postgres",
	dialectModule: pg,
	dialectOptions: {
		ssl: {
			require: true,
			rejectUnauthorized: false,
		},
	},
});

module.exports = sequelize;
`;