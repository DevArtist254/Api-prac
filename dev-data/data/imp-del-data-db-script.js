require('dotenv').config({ path: `${__dirname}/../../config.env` });

////////////////////////////////////////
//Connect to our database
const mongoose = require(`mongoose`);
const fs = require('fs');
// eslint-disable-next-line import/extensions
const Tour = require('../../model/tourModel.js');

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

///////////////////////////////////////////
//Read the file
const tourData = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

//import to our database
const importData = async () => {
  try {
    await Tour.create(tourData);
    console.log(`Data successfully loaded!`);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

//import to our database
const deleteData = async () => {
  try {
    await Tour.deleteMany();
    console.log(`Data successfully delete!`);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
