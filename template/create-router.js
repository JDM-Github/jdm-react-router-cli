module.exports = (routerName, author = "JDM") =>


    `// Author: ${author}
// Created on: ${new Date().toISOString()}

const express = require("express");
const { ${routerName} } = require("../models/models");

class ${routerName} {
    constructor() {
        this.router = express.Router();
        this.getRouter();
        this.postRouter();
    }

    getRouter() {}

    postRouter() {}
}

module.exports = new ${routerName}().router;
`;
