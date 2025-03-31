module.exports = (author = "JDM") => `
// Author: ${author}
// Created on: ${new Date().toISOString()}

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
`;
