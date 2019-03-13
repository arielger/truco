const R = require("ramda");
const mongoose = require("mongoose");
const { DataSource } = require("apollo-datasource");
const { pubsub, events } = require("../subscriptions");

const Match = mongoose.model("Match");

class MatchAPI extends DataSource {
  constructor() {
    super();
  }

  initialize(config) {
    this.context = config.context;
  }

  async getAllMatches({ userId }) {
    const matches = await Match.find({
      status: "waiting",
      creator: { $ne: userId }
    })
      .populate("creator")
      .populate("players");
    return matches.map(m => m.toObject());
  }

  async getMatchById({ matchId }) {
    const match = await Match.findById(matchId)
      .populate("creator")
      .populate("players");
    return match;
  }

  async createMatch({ playersCount, points, userId }) {
    const newMatch = await new Match({
      playersCount,
      points,
      creator: userId,
      players: [userId]
    }).save();

    const newMatchData = (await newMatch
      .populate("creator")
      .populate("players")
      .execPopulate()).toObject();

    pubsub.publish(events.MATCH_ADDED, {
      matchListUpdated: {
        type: "NEW_MATCH",
        ...newMatchData
      }
    });
    return newMatchData;
  }

  async joinMatch({ matchId, userId }) {
    const match = await Match.findById(matchId);

    if (!match) {
      throw new Error(`There is no match with the id ${matchId}`);
    }

    if (match.players.length >= match.playersCount) {
      throw new Error("The match is already full");
    }

    if (match.creator === userId) {
      throw new Error("Can't join your own match");
    }

    if (match.players.includes(userId)) {
      throw new Error("You already joined this match");
    }

    const isFull = match.players.length + 1 >= match.playersCount;

    const updatedMatch = await Match.findByIdAndUpdate(
      matchId,
      {
        $push: { players: userId },
        ...(isFull ? { status: "playing" } : {})
      },
      { new: true }
    )
      .populate("creator")
      .populate("players");

    const updatedMatchData = updatedMatch.toObject();

    pubsub.publish(events.NEW_PLAYER, {
      matchUpdated: { ...updatedMatchData, type: "NEW_PLAYER" }
    });

    // If the match is full remove it from the list of matches
    pubsub.publish(isFull ? events.MATCH_REMOVED : events.MATCH_UPDATED, {
      matchListUpdated: {
        type: isFull ? "DELETED_MATCH" : "UPDATED_MATCH",
        ...updatedMatchData
      }
    });

    return updatedMatchData;
  }
}

module.exports = MatchAPI;
