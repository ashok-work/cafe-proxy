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
// STAGING URLS
const QWIKCAFE_STAGING_SERVICE_URL = 'https://qwikcafestaging.fc.qwikcilver.com/api/customer/';
const GIVEME5_STAGING_SERVICE_URL = 'https://gm5staging.fc.qwikcilver.com/api/customer/';
const KITAPP_STAGING_SERVICE_URL = 'https://fzstaging.fc.qwikcilver.com/api/customer/';

// PRODUCTION URLS
const QWIKCAFE_PROD_SERVICE_URL = 'https://qwikcafe.fc.qwikcilver.com/api/customer/';
const GIVEME5_PROD_SERVICE_URL = 'https://gm5.fc.qwikcilver.com/api/customer/';
const KITAPP_PROD_SERVICE_URL = 'https://kit.fc.qwikcilver.com/api/customer/';

// Logging the requests
app.use(morgan("dev"));

// STAGING Proxy Logic : Proxy endpoints
app.use("/giveme5/staging",
    createProxyMiddleware({
        target: GIVEME5_STAGING_SERVICE_URL,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
            '^/giveme5/staging/': '/', // remove base path
        },
    })
);

app.use("/qwikcafe/staging",
    createProxyMiddleware({
        target: QWIKCAFE_STAGING_SERVICE_URL,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
            '^/qwikcafe/staging/': '/', // remove base path
        },
    })
);

app.use("/kit-app/staging",
    createProxyMiddleware({
        target: KITAPP_STAGING_SERVICE_URL,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
            '^/kit-app/staging/': '/', // remove base path
        },
    })
);

// PRODUCTION Proxy Logic : Proxy endpoints
app.use("/giveme5/prod",
    createProxyMiddleware({
        target: GIVEME5_PROD_SERVICE_URL,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
            '^/giveme5/prod/': '/', // remove base path
        },
    })
);

app.use("/qwikcafe/prod",
    createProxyMiddleware({
        target: QWIKCAFE_PROD_SERVICE_URL,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
            '^/qwikcafe/prod/': '/', // remove base path
        },
    })
);

app.use("/kit-app/prod",
    createProxyMiddleware({
        target: KITAPP_PROD_SERVICE_URL,
        changeOrigin: true,
        logLevel: 'debug',
        pathRewrite: {
            '^/kit-app/prod/': '/', // remove base path
        },
    })
);

/*
app.use("/", createProxyMiddleware({
    target: KITAPP_SERVICE_URL,
    changeOrigin: true,
    logLevel: 'debug',
}));
 */

// Listen both http & https ports
if (config.get('env') === "production") {
    const httpsServer = https.createServer({
        key: fs.readFileSync('/etc/letsencrypt/live/proxy.ashok.work/privkey.pem'),
        cert: fs.readFileSync('/etc/letsencrypt/live/proxy.ashok.work/fullchain.pem'),
        minVersion: "TLSv1.2",
        maxVersion: "TLSv1.2"
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
