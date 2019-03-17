const R = require("ramda");
const mongoose = require("mongoose");
const { DataSource } = require("apollo-datasource");
const { pubsub, events } = require("../subscriptions");
const pickRandom = require("pick-random");

const cards = require("../data/cards");

const Match = mongoose.model("Match");

const isOdd = R.pipe(
  R.modulo(R.__, 2),
  Boolean
);

const formatMatch = R.evolve({
  players: R.map(({ data, ...other }) => ({ ...other, ...data }))
});

const assocCurrentPlayerCards = userId => match =>
  R.assoc(
    "myCards",
    R.pipe(
      R.last,
      R.propOr([], "cardsByPlayer"),
      R.find(cardsByPlayer => cardsByPlayer.playerId.equals(userId)),
      R.propOr([], "cards"),
      R.map(({ _id, ...cardData }) => ({ ...cardData, id: _id }))
    )(match.rounds)
  )(match);

const assocCardsPlayedByPlayers = match =>
  R.assoc(
    "cardsPlayedByPlayer",
    R.pipe(
      R.last,
      R.propOr([], "cardsPlayedByPlayer"),
      R.map(({ playerId, cards }) => ({
        playerId,
        cards: R.map(R.prop("card"))(cards)
      }))
    )(match.rounds)
  )(match);

const assocNextPlayer = match =>
  R.assoc(
    "nextPlayer",
    R.pipe(
      R.last,
      R.prop("nextPlayer")
    )(match.rounds)
  )(match);

const getNewRoundUpdate = playersIds => {
  const playersCards = R.pipe(
    R.map(({ card }) => ({ card, played: false })),
    R.splitEvery(3)
  )(pickRandom(cards, { count: playersIds.length * 3 }));

  return {
    rounds: {
      moves: [],
      cardsByPlayer: playersIds.map((playerId, i) => ({
        playerId,
        cards: playersCards[i]
      })),
      cardsPlayedByPlayer: playersIds.map(playerId => ({
        playerId,
        cards: []
      })),
      nextPlayer: R.head(playersIds)
    }
  };
};

class MatchAPI extends DataSource {
  constructor() {
    super();
  }

  initialize(config) {
    this.context = config.context;
  }

  async getAllMatches({ userId }) {
    return R.map(
      R.pipe(
        match => match.toObject(),
        formatMatch
      )
    )(
      await Match.find({
        status: "waiting",
        creator: { $ne: userId }
      })
        .populate("creator")
        .populate("players.data")
    );
  }

  async getMatchById({ matchId, userId }) {
    const match = R.pipe(
      match => match.toObject(),
      formatMatch,
      assocCurrentPlayerCards(userId),
      assocCardsPlayedByPlayers,
      assocNextPlayer
    )(
      await Match.findById(matchId)
        .populate("creator")
        .populate("players.data")
    );

    // Prevent user from accessing a match not joined
    if (
      match.creator.id !== userId &&
      !R.map(R.prop("id"), match.players).includes(userId)
    ) {
      throw new Error("You must join or own the match to access it's data");
    }

    return match;
  }

  async createMatch({ playersCount, points, userId }) {
    const matchInput = {
      playersCount,
      points,
      creator: userId,
      players: [{ data: userId, isFromFirstTeam: true }]
    };
    const newMatch = await new Match(matchInput).save();

    const newMatchData = R.pipe(
      match => match.toObject(),
      formatMatch
    )(
      await newMatch
        .populate("creator")
        .populate("players.data")
        .execPopulate()
    );

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

    const playersCount = match.players.length + 1;
    const startGame = playersCount >= match.playersCount;

    const originalMatch = (await Match.findById(matchId)).toObject();

    const updatedMatch = R.pipe(
      match => match.toObject(),
      formatMatch,
      assocCardsPlayedByPlayers,
      assocNextPlayer
    )(
      await Match.findByIdAndUpdate(
        matchId,
        {
          status: startGame ? "playing" : "waiting",
          $push: {
            players: {
              data: userId,
              isFromFirstTeam: isOdd(playersCount.length)
            },
            ...(startGame
              ? getNewRoundUpdate([
                  ...R.map(R.prop("data"), originalMatch.players),
                  userId
                ])
              : {})
          }
        },
        { new: true }
      )
        .populate("creator")
        .populate("players.data")
    );

    if (startGame) {
      // Send one event to each player (only show their cards)
      updatedMatch.players.forEach(player => {
        const update = {
          userId: player.id,
          matchUpdated: {
            ...assocCurrentPlayerCards(player.id)(updatedMatch),
            type: events.START_GAME
          }
        };
        pubsub.publish(events.START_GAME, update);
      });
    } else {
      pubsub.publish(events.NEW_PLAYER, {
        matchUpdated: { ...updatedMatch, type: events.NEW_PLAYER }
      });
    }

    // If the match is full remove it from the list of matches
    pubsub.publish(startGame ? events.MATCH_REMOVED : events.MATCH_UPDATED, {
      matchListUpdated: {
        type: startGame ? "DELETED_MATCH" : "UPDATED_MATCH",
        ...updatedMatch
      }
    });

    return updatedMatch;
  }

  async playCard({ matchId, userId, cardId }) {
    const match = await Match.findById(matchId);

    if (!match) {
      throw new Error(`There is no match with the id ${matchId}`);
    }

    if (
      !R.pipe(
        R.map(player => player.data.toString()),
        R.includes(userId)
      )(match.players)
    ) {
      throw new Error(
        `The user with the id ${userId} hasn't joined the match ${matchId}`
      );
    }

    const lastRound = R.last(match.rounds);

    if (!lastRound.nextPlayer.equals(userId)) {
      throw new Error(`It's not the turn of the player with the id ${userId}`);
    }

    const cards = R.pipe(
      R.prop("cardsByPlayer"),
      R.find(cardsByPlayer => cardsByPlayer.playerId.equals(userId)),
      R.prop("cards")
    )(lastRound);

    const selectedCardIndex = R.findIndex(card => card._id.equals(cardId))(
      cards
    );
    const selectedCard = cards[selectedCardIndex];

    if (!selectedCard) {
      throw new Error(
        `There is no card with the id ${cardId} or it has already been played`
      );
    }

    if (selectedCard.played) {
      throw new Error(`The card with the id ${cardId} has already been played`);
    }

    const lastRoundIndex = match.rounds.length - 1;
    const playerIndex = R.findIndex(({ data }) => data.equals(userId))(
      match.players
    );
    const nextPlayerId = R.pipe(
      R.inc,
      R.modulo(R.__, match.playersCount),
      nextPlayerIndex => match.players[nextPlayerIndex].data
    )(playerIndex);

    const updatedMatch = R.pipe(
      match => match.toObject(),
      formatMatch,
      assocCardsPlayedByPlayers,
      assocNextPlayer
    )(
      await Match.findByIdAndUpdate(
        matchId,
        {
          $push: {
            [`rounds.${lastRoundIndex}.cardsPlayedByPlayer.${playerIndex}.cards`]: {
              id: cardId,
              card: selectedCard.card
            }
          },
          $set: {
            [`rounds.${lastRoundIndex}.nextPlayer`]: nextPlayerId,
            [`rounds.${lastRoundIndex}.cardsByPlayer.${playerIndex}.cards.${selectedCardIndex}.played`]: true
          }
        },
        {
          new: true
        }
      )
        .populate("creator")
        .populate("players.data")
    );

    updatedMatch.players.forEach(player => {
      pubsub.publish(events.NEW_MOVE, {
        userId: player.id,
        matchUpdated: {
          ...assocCurrentPlayerCards(player.id)(updatedMatch),
          type: events.NEW_MOVE
        }
      });
    });

    return assocCurrentPlayerCards(userId)(updatedMatch);
  }
}

module.exports = MatchAPI;
