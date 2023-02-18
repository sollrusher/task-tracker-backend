const developmentConfig = {
  port: 4000,
  allowedOrigin: 'http://localhost:3000',
}

const productionConfig = {
  port: 4000,
  allowedOrigin: 'https://fanciful-capybara-a27dac.netlify.app',
}

module.exports = { developmentConfig, productionConfig }
