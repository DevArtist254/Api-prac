/////////////////////////////////////
const express = require("express")
const {
 getAllTours,
 createATour,
 getATour,
 checkId,
} = require("../controller/tourController")
//Routing
const router = express.Router()

router.route("/").get(getAllTours).post(createATour)

router.param("id", checkId)

router.route("/:id").get(getATour)

module.exports = router
