/////////////////////////////////////
const express = require("express")
const {
 getAllTours,
 createATour,
 getATour,
} = require("../controller/tourController")
//Routing
const router = express.Router()

router.route("/").get(getAllTours).post(createATour)

router.route("/:id").get(getATour)

module.exports = router
