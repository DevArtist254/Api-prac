const express = require("express")
const tourRouter = require("./routes/tourRouters")

const app = express()

//////////////////////////////////////
//Gobal Middlewares
app.use(express.json())
app.use(express.static(`${__dirname}/public`))

app.use("/api/v1/tours", tourRouter)

module.exports = app
