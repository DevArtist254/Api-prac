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

const server = app.listen(port, () => {
  console.log(`Your server is running at port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log(`Unhandler rejection! *wft* shutting down...`);
  server.close(() => {
    process.exit(1);
  });
});
