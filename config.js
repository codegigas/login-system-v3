const config = {
  development: {
    PORT: 3000,
    DB_CONNECTION_URL: "mongodb://localhost/login_system_v3"
  },
  production: {
    PORT: 3000,
    DB_CONNECTION_URL: "mongodb://localhost/login_system_v3"
  }
}

module.exports = config[process.env.NODE_ENV];