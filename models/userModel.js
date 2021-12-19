const mongoose = require('mongoose');

//schema & model
const userSchema = new mongoose.Schema({
  username : { type: String, required : true, unique: true},
  log : [{
    description : String,
    duration : Number,
    date : String
  }]
}, { versionKey: false } );
const User = mongoose.model("User", userSchema);

module.exports = User;