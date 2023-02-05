////////////////////////////////////////
//Server
const app = require("./app")

const port = 3000 || process.env.port

app.listen(port, () => {
 console.log(`Your server is running at port ${port}`)
})
