const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const User = require('./api/models/userModel')
const Promo = require('./api/models/promoModel')
const bodyParser = require('body-parser')
const routes = require('./api/routes/routes')

const cors = require('cors')

mongoose.Promise = global.Promise
mongoose.connect( 'mongodb://localhost/newTestDB')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())

routes(app)

app.listen(port)

console.warn(`API started on ${port}`)
