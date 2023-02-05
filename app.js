const express = require("express")
const fs = require("fs")
const urlToDB = `${__dirname}/dev-data/data/tours-simple.json`

const app = express()

//////////////////////////////////////
//Gobal Middlewares
app.use(express.json())

///////////////////////////////////
//Setting up our data
const database = fs.readFileSync(urlToDB, "utf8", (err) => {
 console.log(err)
})

const data = JSON.parse(database)

/////////////////////////////////////
//Routing

//Get all tours
app.get("/", (req, res) => {
 res.status(200).send(data)
})

//Write data to our db
app.post("/", (req, res) => {
 console.log(req.body)

 res.send(`Data written`)
})

//Get a tour
/**
 * Use param to read the requested tour
 * Then find the requested tour
 */
app.get("/:id", (req, res) => {
 //Get the id from the param
 const {id} = req.params

 //Check if the id is vaild
 if (id * 1 > data.length - 1) {
  return res.status(404).send("error")
 }

 //Find the single data resource that matches the id req by user
 const foundData = data.find((el) => el.id === id)

 res.status(200).send(foundData)
})

////////////////////////////////////////
//Server
const port = 3000 || process.env.port

app.listen(port, () => {
 console.log(`Your server is running at port ${port}`)
})
