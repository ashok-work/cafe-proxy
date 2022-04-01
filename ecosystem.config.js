module.exports = {
    apps: [
        {
            name: "cafe-proxy",
            script: "app.js",
            instances: "max",
            exec_mode: "cluster",
            watch: false,
            out_file: "./logs/output.log",
            error_file: "./logs/error.log",
            merge_logs: true,
            env: {
                "NODE_ENV": "default"
            },
            env_production: {
                "NODE_ENV": "production"
            }
        }
    ]
}
