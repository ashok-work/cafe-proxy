const express = require("express");
const morgan = require("morgan");
const config = require("config");
const {createProxyMiddleware} = require("http-proxy-middleware");

console.log(config.get('env'));

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
if (config.get('env') === "production") {
    const httpsServer = https.createServer({
        key: fs.readFileSync('/etc/letsencrypt/live/proxy.ashok.work/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/proxy.ashok.work/fullchain.pem'),
    }, app);
    httpsServer.listen(443, () => {
        console.log('HTTPS Server running on port 443');
    });
} else {
    const httpServer = http.createServer(app);
    httpServer.listen(3000, () => {
        console.log('HTTP Server running on port 3000');
    });
}
