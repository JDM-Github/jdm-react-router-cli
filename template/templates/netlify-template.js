module.exports = ({ config = {}, author = "JDM" }) => {
  const {
    folder = "backend",
    functions = "functions",
    routes = "routes",
    models = "models",
    middlewares = "middlewares",
  } = config;

  return `
// Author: ${author}
// Created on: ${new Date().toISOString()}

[build]
  node_bundler = "esbuild"
  functions = "${folder}/${functions}"
  publish = "frontend/build"
  included_files = [
    "${folder}/${models}/**",
    "${folder}/${middlewares}/**",
    "${folder}/${routes}/**",
    "${folder}/lib/**",
    "${folder}/utils/**",
    "${folder}/helpers/**",
  ]
  command = "npm install && npm run build"

[dev]
  node_bundler = "esbuild"
  functions = "${folder}/${functions}"
  publish = "dist"
  included_files = [
    "${folder}/${models}/**",
    "${folder}/${middlewares}/**",
    "${folder}/${routes}/**",
    "${folder}/lib/**",
    "${folder}/utils/**",
    "${folder}/helpers/**",
  ]

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;
};
