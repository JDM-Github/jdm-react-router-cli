
// Author: [object Object]
// Created on: 2025-03-31T12:48:06.910Z

require("dotenv").config();
const pg = require("pg");

module.exports = {
	development: {
		use_env_variable: "DATABASE_URL",
		dialect: "postgres",
		dialectModule: pg,
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false,
			},
		},
	},
};
