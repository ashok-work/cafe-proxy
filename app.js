const express = require("express");
const morgan = require("morgan");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Create Express Server
const app = express();

// Configuration
const API_SERVICE_URL = 'https://fzstaging.fc.qwikcilver.com/api/customer/';

// Logging the requests
app.use(morgan("dev"));

// Proxy Logic : Proxy endpoints
app.use("/all-active-cafes",
	createProxyMiddleware({
		target: API_SERVICE_URL,
		changeOrigin: true,
		logLevel: 'debug',
	})
);

app.get("*", function (req, res) {
	res.json({status: true});
});

// Starting our Proxy server
app.listen(process.env.PORT || 5000, () => {
	console.log(`Starting Proxy at ${process.env.PORT || 5000}`);
});
