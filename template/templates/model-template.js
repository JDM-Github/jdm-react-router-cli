module.exports = (author = "JDM") => `
// Author: ${author}
// Created on: ${new Date().toISOString()}

module.exports = {
	sequelize: require("./Sequelize.js"),
};
`;
