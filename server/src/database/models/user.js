const mongoose = require("mongoose");
const mongooseHidden = require("mongoose-hidden")();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

userSchema.set("toObject", {
  virtuals: true
});

userSchema.plugin(mongooseHidden);

const User = mongoose.model("User", userSchema);

module.exports = User;
