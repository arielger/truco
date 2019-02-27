const R = require("ramda");
const mongoose = require("mongoose");
const { DataSource } = require("apollo-datasource");
const { pubsub, events } = require("../subscriptions");

const Match = mongoose.model("Match");
const User = mongoose.model("User");

class MatchAPI extends DataSource {
  constructor() {
    super();
  }

  initialize(config) {
    this.context = config.context;
  }

  async getAllMatches() {
    const matches = await Match.find({});
    return matches;
  }

  async getMatchById({ matchId }) {
    const match = await Match.findById(matchId);
    return match;
  }

  async createMatch({ match, userId }) {
    const newMatch = await new Match({
      ...match,
      creatorId: userId
    }).save();
    const newMatchData = newMatch.toObject();
    const creator = await User.findById(userId, { lean: true });
    pubsub.publish(events.MATCH_ADDED, { matchAdded: newMatchData });
    const result = {
      id: newMatchData._id,
      ...R.pick(["playersCount", "points"], newMatchData),
      creator: {
        id: creator._id,
        name: creator.name
      }
    };
    console.log("result", result);
    return result;
  }
}

module.exports = MatchAPI;
