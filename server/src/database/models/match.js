const mongoose = require("mongoose");
const shortid = require("shortid");

const matchSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate
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
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  }
});

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
