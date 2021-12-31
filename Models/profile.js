const mongoose = require("mongoose");

const ProfileModel = mongoose.Schema({
  user:{
      type: String,
      required:true
  },
  name: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  tidy: {
    type: Number,
    required: true,
  },
  introvert: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  comfort: {
    type: Array,
    required: true,
  },
  show:{
      type: Boolean,
      required: true
  }
 
});

module.exports = mongoose.model("ProfileModel", ProfileModel);