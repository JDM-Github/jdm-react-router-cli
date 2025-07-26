"use strict";
module.exports = (seederName, config = {}, author = "JDM") => {
	const { models = "models" } = config;

	return `
// Author: ${author}
// Created on: ${new Date().toISOString()}

"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert(
			"${seederName}s",
			[
				{
				},
			],
			{}
		);
	},
	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("${seederName}s", null, {});
	},
};
`;
};