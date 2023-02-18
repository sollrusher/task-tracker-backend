const cors = require('cors')
const express = require('express')
const { json } = express
const helmet = require('helmet')
const onError = require('./utils/onError.js')
const { developmentConfig, productionConfig } = require('./config/index.js')
const userRoute = require('./routes/user');
const taskRoute = require('./routes/task');


const isProduction = process.env.NODE_ENV === 'production'
console.log('currentenv =',process.env.NODE_ENV);
let config
if (isProduction) {
  config = productionConfig
} else {
  config = developmentConfig
}

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: config.allowedOrigin,
  })
)
app.use(json())

app.use('/user', userRoute)
app.use('/task', taskRoute)

app.use('*', (req, res) => {
  res.status(404).json({ message: 'Page not found' })
})
app.use(onError)

app.listen(config.port, () => {
  console.log('🚀 Server ready to handle requests')
})
