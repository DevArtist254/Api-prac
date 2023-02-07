const fs = require("fs")
const urlToDB = `${__dirname}/../dev-data/data/tours-simple.json`

///////////////////////////////////
//Setting up our data
const database = fs.readFileSync(urlToDB, "utf8", (err) => {
 console.log(err)
})

const data = JSON.parse(database)

///////////////////////////////////////////
//Middleware
exports.checkId = (req, res, next, val) => {
 if (req.params.id * 1 > tours.length) {
  return res.status(404).json({
   status: "fail",
   message: "Invalid ID",
  })
 }

 next()
}

//////////////////////////////////
//Controller

exports.getAllTours = (req, res) => {
 res.status(200).json({
  status: "success",
  requestedAt: req.requestTime,
  tours: {
   data,
  },
 })
}

exports.createATour = (req, res) => {
 console.log(req.body)

 res.send(`Data written`)
}

exports.getATour = (req, res) => {
 //Get a tour
 /**
  * Use param to read the requested tour
  * Then find the requested tour
  */
 //Get the id from the param
 const {id} = req.params

 //Check if the id is vaild
 if (id * 1 > data.length - 1) {
  return res.status(404).send("error")
 }

 //Find the single data resource that matches the id req by user
 const foundData = data.find((el) => el.id === id)

 res.status(200).send(foundData)
}
