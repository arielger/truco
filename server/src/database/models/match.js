const mongoose = require("mongoose");
const shortid = require("shortid");
const mongooseHidden = require("mongoose-hidden")();
const { cards } = require("../../utils/cards");

const cardValidator = {
  validator: (card) => cards.includes(card),
  message: (props) => `${props.value} is not a valid card`,
};

const roundSchema = new mongoose.Schema({
  winner: {
    type: String,
    enum: ["first", "second"],
  },
  hands: {
    type: [
      {
        winnerTeam: {
          type: String,
          enum: ["first", "second", "tie"],
          required: true,
        },
        initialPlayerIndex: {
          type: Number,
          required: true,
        },
      },
    ],
    validate: {
      validator: (val) => val.length <= 3,
      message: (props) => `${props.value} length is greater than 3`,
    },
  },
  moves: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
  ],
  cardsByPlayer: [
    {
      playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      cards: [
        {
          card: {
            type: String,
            validate: cardValidator,
            required: true,
          },
          played: {
            type: Boolean,
            required: true,
            default: false,
          },
        },
      ],
    },
  ],
  cardsPlayedByPlayer: [
    {
      playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      cards: {
        type: [
          {
            id: {
              type: mongoose.Schema.Types.ObjectId,
              required: true,
            },
            card: {
              type: String,
              validate: cardValidator,
              required: true,
            },
          },
        ],
        validate: {
          validator: (val) => val.length <= 3,
          message: (props) => `${props.value} length is greater than 3`,
        },
      },
    },
  ],
  nextPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  truco: {
    type: {
      type: String,
      enum: ["TRUCO", "RETRUCO", "VALE_CUATRO"],
      required: true,
    },
    status: {
      type: String,
      enum: ["ACCEPTED", "REJECTED", "PENDING"],
      required: true,
    },
    isFromFirstTeam: {
      type: Boolean,
      required: true,
    },
    hand: {
      type: Number,
      required: true,
    },
  },
  envido: {
    list: [
      {
        type: String,
        enum: ["ENVIDO", "REAL_ENVIDO", "FALTA_ENVIDO"],
      },
    ],
    status: {
      type: String,
      enum: ["ACCEPTED", "REJECTED", "PENDING"],
      required: true,
    },
    isFromFirstTeam: {
      type: Boolean,
      required: true,
    },
  },
  nextPlayerEnvido: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  envidoPoints: [
    {
      playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      isFromFirstTeam: {
        type: Boolean,
        required: true,
      },
      moveType: {
        type: String,
        enum: ["POINTS", "CANT_WIN"],
      },
      points: {
        type: Number,
      },
    },
  ],
  playersOutOfHand: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

roundSchema.set("toObject", {
  virtuals: true,
});

const matchSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: shortid.generate,
  },
  status: {
    type: String,
    enum: ["waiting", "playing", "finished"],
    required: true,
    default: "waiting",
  },
  playersCount: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => [2, 4, 6].includes(v),
      message: (props) => `${props.value} is not a valid players count`,
    },
  },
  points: {
    type: Number,
    required: true,
    validate: {
      validator: (v) => [15, 30].includes(v),
      message: (props) => `${props.value} is not a valid points number`,
    },
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  players: [
    {
      // @todo: Replace "data" with playerId
      data: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      isFromFirstTeam: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
  ],
  rounds: [roundSchema],
  pointsFirstTeam: {
    type: Number,
    required: true,
    validate: {
      validator: (n) => n >= 0 && n <= 30,
      message: (props) => `${props.value} is not a valid points number`,
    },
    default: 0,
  },
  pointsSecondTeam: {
    type: Number,
    required: true,
    validate: {
      validator: (n) => n >= 0 && n <= 30,
      message: (props) => `${props.value} is not a valid points number`,
    },
    default: 0,
  },
  winnerTeam: {
    type: String,
    enum: ["first", "second"],
  },
});

matchSchema.set("toObject", {
  virtuals: true,
});

matchSchema.plugin(mongooseHidden);

const Match = mongoose.model("Match", matchSchema);

module.exports = Match;
