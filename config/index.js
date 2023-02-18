const developmentConfig = {
  port: 4000,
  allowedOrigin: 'http://localhost:3000',
}

const productionConfig = {
  port: 4000,
  allowedOrigin: 'http://localhost:4000',
}

module.exports = { developmentConfig, productionConfig }
