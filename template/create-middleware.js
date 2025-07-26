module.exports = (name, config={}, author = "JDM") => `// Author: ${author}
// Created on: ${new Date().toISOString()}

module.exports = function ${name}Middleware(req, res, next) {
    console.log("Middleware ${name} executed.");
    next();
};
`;
