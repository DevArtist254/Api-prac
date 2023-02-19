require('dotenv').config({ path: './config.env' });

////////////////////////////////////////
//Server
const mongoose = require(`mongoose`);
const app = require('./app');

const DB = process.env.DB_CONNECT.replace(
  '<PASSWORD>',
  process.env.DB_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log(`DB Connection was success`);
  });

const port = 3000 || process.env.port;

app.listen(port, () => {
  console.log(`Your server is running at port ${port}`);
});
