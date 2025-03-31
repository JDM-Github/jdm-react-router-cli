#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { program } from "commander";
import chalk from "chalk";
import ora from "ora";
import { pathToFileURL } from "url";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

console.log(
	chalk.blueBright(`
   ____________  ___
  |_  |  _  \  \/  |
    | | | | | .  . |
    | | | | | |\/| |
/\__/ / |/ /| |  | |
\____/|___/ \_|  |_/  CLI v1.0.0
`)
);

const author = "JDM";
let defaultConfig = {
	project_name: "",
	folder: "backend",
	functions: "functions",
	routes: "routes",
	models: "models",
	middlewares: "middlewares",
	database_url: "your_database_url_here",
	secret_key: "your_secret_key_here",
};

const configPath = path.join(process.cwd(), "jdm.config.js");
let config = {};
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function loadConfig() {
	if (fs.existsSync(configPath)) {
		try {
			const userConfig = await import(pathToFileURL(configPath).href);
			config = { ...defaultConfig, ...userConfig.default };

			console.log(chalk.green("✅ Loaded and merged config file."));
			console.log(
				chalk.blueBright("---------------------------------------")
			);
			console.log(chalk.cyan("🔍 Final Config:"), config);
		} catch (error) {
			console.error(
				chalk.red("❌ Failed to load config file:", error.message)
			);
			config = { ...defaultConfig };
		}
	} else {
		config = { ...defaultConfig };
		fs.writeFileSync(
			configPath,
			`// Author: ${author}\n// Created on: ${new Date().toISOString()}\nmodule.exports = ${JSON.stringify(
				config,
				null,
				2
			)};\n`,
			"utf8"
		);
		console.log(
			chalk.yellow(
				"⚠️ No config file found. Created default `jdm.config.js`."
			)
		);
		console.log(chalk.cyan("📄 Default Config:"), config);
	}
}

async function cleanProject() {
	const projectRoot = process.cwd();
	fs.readdirSync(projectRoot).forEach((item) => {
		const itemPath = path.join(projectRoot, item);

		if (item === "jdm.config.js") return;
		if (fs.statSync(itemPath).isDirectory()) {
			fs.rmSync(itemPath, { recursive: true, force: true });
			console.log(chalk.red(`🗑️ Deleted folder: ${itemPath}`));
		} else {
			fs.unlinkSync(itemPath);
			console.log(chalk.red(`🗑️ Deleted file: ${itemPath}`));
		}
	});

	console.log(chalk.green("✅ Project cleaned successfully."));
}

async function askToOverwrite(filePath, force = false) {
	if (fs.existsSync(filePath)) {
		console.log(chalk.yellow(`⚠️ File '${filePath}' already exists.`));

		if (force) {
			console.log(
				chalk.green(
					"🚀 Force mode is active. Automatically overwriting..."
				)
			);
			return false;
		}

		const rl = readline.createInterface({ input, output });
		const answer = await rl.question(chalk.redBright("Overwrite? (Y/N): "));
		rl.close();

		return answer.toLowerCase() !== "y";
	}
	return false;
}

function createFolder(folderPath) {
	if (!fs.existsSync(folderPath)) {
		fs.mkdirSync(folderPath, { recursive: true });
		console.log(chalk.green(`📁 Created folder: ${folderPath}`));
	}
}

async function createFile(filePath, content, force = false) {
	if (!(await askToOverwrite(filePath, force))) {
		fs.writeFileSync(filePath, content, "utf8");
		console.log(chalk.green(`✅ Created file: ${filePath}`));
	}
}

async function createOrUpdateGitignore() {
	const gitignorePath = path.join(process.cwd(), ".gitignore");
	const newEntries = [
		`${config.folder || "backend"}/**`,
		".netlify",
		".env",
		"node_modules",
	];

	if (!fs.existsSync(gitignorePath)) {
		fs.writeFileSync(gitignorePath, newEntries.join("\n") + "\n", "utf8");
		console.log(chalk.green(`✅ Created file: ${gitignorePath}`));
		return;
	}

	const existingContent = fs.readFileSync(gitignorePath, "utf8").split("\n");
	const finalEntries = [...new Set([...existingContent, ...newEntries])];

	fs.writeFileSync(gitignorePath, finalEntries.join("\n") + "\n", "utf8");
	console.log(chalk.green(`✅ Updated file: ${gitignorePath}`));
}

async function createOrUpdateEnv() {
	const envPath = path.join(process.cwd(), ".env");
	const newEntries = [
		`DATABASE_URL=${config.database_url || "your_database_url_here"}`,
		`SECRET_KEY=${config.secret_key || "your_secret_key_here"}`,
	];

	if (!fs.existsSync(envPath)) {
		fs.writeFileSync(envPath, newEntries.join("\n") + "\n", "utf8");
		console.log(chalk.green(`✅ Created file: ${envPath}`));
		return;
	}

	const existingLines = fs
		.readFileSync(envPath, "utf8")
		.split("\n")
		.filter(Boolean);
	const existingKeys = new Set(
		existingLines.map((line) => line.split("=")[0])
	);

	const finalEntries = [
		...existingLines,
		...newEntries.filter((line) => !existingKeys.has(line.split("=")[0])),
	];

	fs.writeFileSync(envPath, finalEntries.join("\n") + "\n", "utf8");
	console.log(chalk.green(`✅ Updated file: ${envPath}`));
}

async function createOrUpdatePackageJson(customConfig = {}) {
	const packageJsonPath = path.join(process.cwd(), "package.json");
	let packageData = {
		name: config.project_name || "my-project",
		version: "1.0.0",
		description: "",
		main: "index.js",
		scripts: {
			start: "node index.js",
		},
		dependencies: {},
		devDependencies: {},
	};
	const willCreate = !fs.existsSync(packageJsonPath);
	if (!willCreate) {
		console.log(chalk.yellow("Updating package.json..."));
		const existingData = JSON.parse(
			fs.readFileSync(packageJsonPath, "utf8")
		);
		packageData.scripts = {
			...existingData.scripts,
			...customConfig.scripts,
		};
		packageData.dependencies = {
			...existingData.dependencies,
			...customConfig.dependencies,
		};
		packageData.devDependencies = {
			...existingData.devDependencies,
			...customConfig.devDependencies,
		};

		packageData = { ...packageData, ...existingData };
	} else {
		console.log(chalk.yellow("Creating package.json..."));
		packageData.scripts = {
			...customConfig.scripts,
		};
		packageData.dependencies = {
			...customConfig.dependencies,
		};
		packageData.devDependencies = {
			...customConfig.devDependencies,
		};
	}

	fs.writeFileSync(
		packageJsonPath,
		JSON.stringify(packageData, null, 2) + "\n",
		"utf8"
	);
	console.log(
		chalk.green(
			`✅ ${willCreate ? "Created" : "Updated"} file: ${packageJsonPath}`
		)
	);
}

async function createFileFromTemplate(
	templatePath,
	destinationPath,
	params = {},
	force = false
) {
	try {
		const modulePath = pathToFileURL(
			path.join(__dirname, templatePath)
		).href;
		const templateContent = await import(modulePath).then((mod) =>
			mod.default(params)
		);
		await createFile(destinationPath, templateContent, force);
	} catch (err) {
		console.error("❌ Error loading template:", err.message);
		process.exit(1);
	}
}
program
	.name("jdm")
	.description(
		chalk.yellow(
			"JDM CLI - Generate setup, Express routers, models, middleware, and more effortlessly."
		)
	)
	.version("1.0.0");

program
	.command("license")
	.description("Display JDM-CLI license information")
	.action(() => {
		const licensePath = path.join(__dirname, "LICENSE");

		if (fs.existsSync(licensePath)) {
			const licenseText = fs.readFileSync(licensePath, "utf8");
			console.log(
				chalk.green("JDM CLI is licensed under the MIT License.\n")
			);
			console.log(chalk.yellow(licenseText));
		} else {
			console.log(
				chalk.red("License file not found in JDM-CLI directory.")
			);
		}
	});

program.command("clean").action(async () => {
	console.log(chalk.red("🧹 Cleaning project directory..."));
	await cleanProject();
	console.log(chalk.green("✅ Project cleaned successfully."));
});

program
	.command("create <type> <name>")
	.description("Generate a new router, model, or middleware")
	.action(async (type, name) => {
		await loadConfig();
		const validTypes = ["router", "model", "middleware"];

		if (!validTypes.includes(type)) {
			console.log(
				chalk.red(
					`❌ Unknown type: '${type}'. Available types: router, model, middleware`
				)
			);
			process.exit(1);
		}

		const templatePath = path.join(
			__dirname,
			"template",
			`create-${type}.js`
		);
		if (!fs.existsSync(templatePath)) {
			console.log(chalk.red(`❌ Template for '${type}' not found.`));
			process.exit(1);
		}
		const paths = {
			router: config.folder + config.routes || "backend/routes",
			model: config.folder + config.models || "backend/models",
			middleware:
				config.folder + config.middlewares || "backend/middlewares",
		};

		const targetDir = path.join(process.cwd(), paths[type]);
		const filePath = path.join(targetDir, `${name}.js`);

		if (!(await askToOverwrite(filePath))) {
			await createFile();
		}
		async function createFile() {
			const spinner = ora(
				chalk.yellow(`Creating ${type} '${name}'...`)
			).start();

			try {
				fs.mkdirSync(targetDir, { recursive: true });

				const templateURL = pathToFileURL(templatePath).href;
				const generateTemplate = await import(templateURL)
					.then((mod) => mod.default ?? mod)
					.catch((err) => {
						console.error(
							"❌ Error loading template:",
							err.message
						);
						process.exit(1);
					});

				const template = generateTemplate(name, author);

				fs.writeFileSync(filePath, template, "utf8");

				spinner.succeed(
					chalk.green(
						`✅ ${
							type.charAt(0).toUpperCase() + type.slice(1)
						} '${name}' created at ${paths[type]}/${name}.js`
					)
				);
			} catch (err) {
				spinner.fail(
					chalk.red(`❌ Error creating file: ${err.message}`)
				);
				process.exit(1);
			}
		}
	});

program
	.command("setup")
	.description("Generate project structure and Netlify setup")
	.option("-f, --force", "Force overwrite all files")
	.option("-c, --clean", "Clean the project before setup")
	.action(async (options) => {
		await loadConfig();
		const force = options.force || false;
		const clean = options.clean || false;

		if (clean) {
			console.log(chalk.red("🧹 Cleaning project directory..."));
			await cleanProject();
			console.log(chalk.green("✅ Project cleaned successfully."));
		}

		console.log(chalk.yellow("Setting up project structure..."));
		await createOrUpdateEnv();
		await createOrUpdateGitignore();
		await createOrUpdatePackageJson({
			scripts: {
				start: "netlify dev",
				login: "netlify login",
				build: "netlify deploy --prod",
				migrate: `node ${config.folder || "backend"}/migrate.js`,
				seed: "npx sequelize-cli db:seed:all",
			},
			dependencies: {
				express: "^4.19.2",
				"express-async-handler": "1.2.0",
				"express-basic-auth": "^1.2.1",
				http: "^0.0.1-security",
				jsonwebtoken: "^9.0.2",
				"live-server": "^1.2.2",
				multer: "^1.4.5-lts.1",
				"netlify-cli": "^17.26.2",
				"netlify-lambda": "^2.0.16",
				"node-forge": "^1.3.1",
				nodemailer: "^6.9.14",
				pg: "^8.12.0",
				sequelize: "6.37.4",
				"sequelize-cli": "6.6.2",
				"serverless-http": "^3.2.0",
				bcryptjs: "^2.4.3",
				cors: "^2.8.5",
				dotenv: "^16.4.5",
			},
		});

		const folders = [
			config.models || "models",
			config.middlewares || "middlewares",
			config.routes || "routes",
			"lib",
			"utils",
			"helpers",
		];
		const mainFolder = config.folder || "backend";
		const functionsFolder = config.functions || "functions";
		const projectRoot = process.cwd() + "/" + mainFolder;
		createFolder(path.join(process.cwd(), "config"));
		createFolder(path.join(process.cwd(), "seeders"));
		createFolder(path.join(projectRoot, functionsFolder));
		folders.forEach((folder) =>
			createFolder(path.join(projectRoot, folder))
		);

		console.log(chalk.green(`✅ Project folders succesfully created.`));
		console.log(chalk.yellow("Creating template files..."));

		await createFileFromTemplate(
			"template/templates/netlify-template.js",
			path.join(process.cwd(), "netlify.toml"),
			{ config, author },
			force
		);
		await createFileFromTemplate(
			"template/templates/api-template.js",
			path.join(projectRoot, config.functions || "functions", "api.js"),
			{ config, author },
			force
		);
		await createFileFromTemplate(
			"template/templates/model-template.js",
			path.join(projectRoot, config.models || "models", "models.js"),
			{ author },
			force
		);
		await createFileFromTemplate(
			"template/templates/sequelize-template.js",
			path.join(projectRoot, config.models || "models", "sequelize.js"),
			{ author },
			force
		);
		await createFileFromTemplate(
			"template/templates/migrate-template.js",
			path.join(process.cwd(), config.folder || "backend", "migrate.js"),
			{ config, author },
			force
		);
		await createFileFromTemplate(
			"template/templates/config-template.js",
			path.join(process.cwd(), "config", "config.js"),
			{ author },
			force
		);
		console.log(chalk.green("✅ Project setup complete! 🎉"));
	});

program.parse(process.argv);
