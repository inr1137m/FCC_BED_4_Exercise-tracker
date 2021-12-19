const mongoose = require('mongoose');

//schema & model
const LogSchema = new mongoose.Schema({
  uid : { type: String, required : true},
  username : String,
  description : String,
  duration : Number,
  date : Date }, { versionKey: false } );
  
const Logs = mongoose.model("Logs", LogSchema);

module.exports = Logs;