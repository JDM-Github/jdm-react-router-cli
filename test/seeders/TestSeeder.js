
// Author: JDM
// Created on: 2025-04-01T08:22:09.832Z

"use strict";

module.exports = {
	up: async (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert(
			"Tests",
			[
				{
				},
			],
			{}
		);
	},
	down: async (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete("Tests", null, {});
	},
};
