module.exports = (author = "JDM") => `
// Author: ${author}
// Created on: ${new Date().toISOString()}

const fs = require("fs");
const path = require("path");
const express = require("express");

const router = express.Router();

const routesPath = __dirname;
fs.readdirSync(routesPath).forEach((file) => {
	if (file !== "Routes.js" && file.endsWith("Router.js")) {
		const route = require(path.join(routesPath, file));
		const routeName = \`/\${file.replace("Router.js", "").toLowerCase()}\`;
		console.log(\`✅ Loaded route: \${routeName}\`);
		router.use(routeName, route);
	}
});

module.exports = router;
`;