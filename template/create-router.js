module.exports = (routerName, config = {}, author = "JDM") => {
	const { models = "models" } = config;

	return `// Author: ${author}
// Created on: ${new Date().toISOString()}

const express = require("express");
const { ${routerName} } = require("../${models}/Models");

class ${routerName}Router {
    constructor() {
        this.router = express.Router();
        this.getRouter();
        this.postRouter();
    }

    getRouter() {
        this.router.get("/get-all", async (req, res) => {
			try {
				const ${routerName.toLowerCase()}s = await ${routerName}.findAll();
				return res.json({
					success: true,
					message: "Successfully fetched all ${routerName.toLowerCase()}s.",
					${routerName.toLowerCase()}s,
				});
			} catch (err) {
				console.error(err);
				return res.status(500).json({
					success: false,
					message: "Internal server error.",
				});
			}
		});
    }

    postRouter() {}
}

module.exports = new ${routerName}Router().router;
`;
};
