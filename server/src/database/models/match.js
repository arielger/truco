const mongoose = require("mongoose");
const shortid = require("shortid");
const mongooseHidden = require("mongoose-hidden")();

const matchSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
  },
  status: {
    type: String,
    enum: ["waiting", "playing", "finished"],
    required: true,
    default: "waiting"
  },
  playersCount: {
    type: Number,
    required: true,
    validate: {
      validator: v => [2, 4, 6].includes(v),
      message: props => `${props.value} is not a valid players count`
    }
  },
  points: {
    type: Number,
    required: true,
    validate: {
      validator: v => [15, 30].includes(v),
      message: props => `${props.value} is not a valid points number`
    }
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  players: [
    {
      type: String,
      ref: "User"
    }
  ]
});

matchSchema.set("toObject", {
  virtuals: true
});

matchSchema.plugin(mongooseHidden);

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
