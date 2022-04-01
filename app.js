const express = require("express");
const morgan = require("morgan");
const {createProxyMiddleware} = require("http-proxy-middleware");

// Create Express Server
const app = express();
const cors = require('cors');

const https = require('https');
const http = require('http');
const fs = require('fs');

app.use(cors());
// Configuration
const API_SERVICE_URL = 'https://fzstaging.fc.qwikcilver.com/api/customer/';

// Logging the requests
app.use(morgan("dev"));

// Proxy Logic : Proxy endpoints
app.use("/",
    createProxyMiddleware({
        target: API_SERVICE_URL,
        changeOrigin: true,
        logLevel: 'debug',
    })
);

// Listen both http & https ports
const httpServer = http.createServer(app);
const httpsServer = https.createServer({
    key: fs.readFileSync('/etc/letsencrypt/live/proxy.ashok.work/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/proxy.ashok.work/fullchain.pem'),
}, app);

httpServer.listen(80, () => {
    console.log('HTTP Server running on port 80');
});

httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});
