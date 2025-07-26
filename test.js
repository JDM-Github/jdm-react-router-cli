const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const path = require("path");
const { sequelize, User, AdminUser } = require("../models/models.js");
const bodyParser = require("body-parser");

const app = express();
const router = express.Router();

// -------------------------------------------------------------------------------
// CORS CONFIGURATION
// -------------------------------------------------------------------------------
DEVELOPMENT = false;
if (DEVELOPMENT) {
	app.use(
		cors({
			origin: "http://localhost:5173",
			credentials: true,
			optionSuccessStatus: 200,
		})
	);
	router.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "../client/build"), "index.html");
	});
} else {
	app.use(cors());
}

// -------------------------------------------------------------------------------
// ALL ROUTES
// -------------------------------------------------------------------------------
router.get("/test", async (req, res) => {
	res.status(200).json("This is a test endpoint.");
});
router.get("/reset", async (req, res) => {
	await sequelize.sync({ force: true });
	res.send("Database reset successful.");
});


// EXAMPLE WHEN I CREATE A ROUTER, IT WILL AUTOMATICALLY ADD IT HERE
router.use("/adminusers", require("../routes/AdminRouter.js"));
router.use("/users", require("../routes/UserRouter.js"));
router.use("/plants", require("../routes/PlantRouter.js"));
router.use("/diseases", require("../routes/DiseaseRouter.js"));

// -------------------------------------------------------------------------------
// APP MIDDLEWARE
// -------------------------------------------------------------------------------
app.use(bodyParser.json());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../client/build")));

// Set base path for serverless functions
app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
