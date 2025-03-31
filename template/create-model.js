module.exports = (name, author = "JDM") => `// Author: ${author}
// Created on: ${new Date().toISOString()}

const sequelize = require("../sequelize.js");
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
