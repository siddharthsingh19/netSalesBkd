const mongoose = require('mongoose');

const formDataSchema = new mongoose.Schema({
  500: Number,
  100: Number,
  50: Number,
  10: Number,
  5: Number,
  2: Number,
  1: Number,
  CDsub: Number,
  due: Number,
  CDadd: Number,
  paytm: Number,
  previnDrawer: Number,
  date: Date,
  CDamount: Number, // New field for CD amount
  DrawerAmount: Number, // New field for Drawer amount
});

const FormData = mongoose.model('FormData', formDataSchema);

module.exports = FormData;
