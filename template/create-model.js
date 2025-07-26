module.exports = (name, config={}, author = "JDM") => `// Author: ${author}
// Created on: ${new Date().toISOString()}

const sequelize = require("./Sequelize.js");
const { DataTypes } = require("sequelize");

const ${name} = sequelize.define(
    "${name}",
    {
        // Define model attributes here
    },
    {
        timestamps: true,
    }
);

module.exports = ${name};
`;
