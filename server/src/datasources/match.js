const R = require("ramda");
const mongoose = require("mongoose");
const { DataSource } = require("apollo-datasource");
const delay = require("delay");

const { pubsub, events } = require("../subscriptions");

const { getHandTeamWinner } = require("../utils/cards");
const {
  getNewRoundData,
  getRoundWinnerTeam,
  getMatchWinnerTeam,
  isLastPlayerFromTeam
} = require("../utils/round");
const {
  isValidTrucoAction,
  getRoundTrucoPoints,
  assocTrucoStatus
} = require("../utils/truco");
const {
  isValidEnvidoAction,
  getRoundEnvidoPoints,
  assocEnvidoStatus,
  getEnvidoWinnerTeam
} = require("../utils/envido");

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

const assocIsLastPlayerFromTeam = userId => match =>
  R.assoc("isLastPlayerFromTeam", isLastPlayerFromTeam(match, userId), match);

const assocPoints = userId => match => {
  const { players, pointsFirstTeam, pointsSecondTeam } = match;
  const isUserFromFirstTeam = R.pipe(
    R.find(R.propEq("id", userId)),
    R.prop("isFromFirstTeam")
  )(players);
  return R.pipe(
    R.assoc(
      "myPoints",
      isUserFromFirstTeam ? pointsFirstTeam : pointsSecondTeam
    ),
    R.assoc(
      "theirPoints",
      isUserFromFirstTeam ? pointsSecondTeam : pointsFirstTeam
    )
  )(match);
};

const assocRoundWinnerTeam = userId => match => {
  const { players } = match;
  const userTeam = R.pipe(
    R.find(R.propEq("id", userId)),
    R.prop("isFromFirstTeam"),
    isFromFirstTeam => (isFromFirstTeam ? "first" : "second")
  )(players);
  const roundWinnerTeam = R.pipe(
    R.last,
    R.prop("winner")
  )(match.rounds);

  return R.assoc(
    "roundWinnerTeam",
    roundWinnerTeam ? (userTeam === roundWinnerTeam ? "we" : "them") : null
  )(match);
};

const assocMatchWinnerTeam = userId => match => {
  const { players } = match;
  const userTeam = R.pipe(
    R.find(R.propEq("id", userId)),
    R.prop("isFromFirstTeam"),
    isFromFirstTeam => (isFromFirstTeam ? "first" : "second")
  )(players);

  return R.assoc(
    "matchWinnerTeam",
    match.winnerTeam ? (userTeam === match.winnerTeam ? "we" : "them") : null
  )(match);
};

// @todo -> Review error handling
// https://blog.apollographql.com/full-stack-error-handling-with-graphql-apollo-5c12da407210
const validateMatchAction = (matchId, match, userId) => {
  if (!match) {
    return `There is no match with the id ${matchId}`;
  }

  if (match.winnerTeam) {
    return `The match with the id ${matchId} is already finished`;
  }

  if (
    !R.pipe(
      R.map(player => player.data.toString()),
      R.includes(userId)
    )(match.players)
  ) {
    return `The user with the id ${userId} hasn't joined the match ${matchId}`;
  }
};

class MatchAPI extends DataSource {
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
      assocNextPlayer,
      assocIsLastPlayerFromTeam(userId),
      assocPoints(userId),
      assocRoundWinnerTeam(userId),
      assocTrucoStatus(userId),
      assocEnvidoStatus(userId)
    )(
      await Match.findById(matchId)
        .populate("creator")
        .populate("players.data")
    );

    // Prevent user from accessing a match not joined if it's already started
    if (
      match.status !== "waiting" &&
      match.creator.id !== userId &&
      !R.map(R.prop("id"), match.players).includes(userId)
    ) {
      throw new Error("You must join or own the match to access it's data");
    }

    if (match.winnerTeam) {
      throw new Error("This match is already finished");
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
              ? {
                  rounds: getNewRoundData([
                    ...R.map(R.prop("data"), originalMatch.players),
                    userId
                  ])
                }
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
            ...R.pipe(
              assocCurrentPlayerCards(player.id),
              assocPoints(player.id),
              assocIsLastPlayerFromTeam(player.id)
            )(updatedMatch),
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

    const actionError = validateMatchAction(matchId, match, userId);

    if (actionError) {
      throw new Error(actionError);
    }

    const currentRound = R.last(match.rounds);

    if (!currentRound.nextPlayer.equals(userId)) {
      throw new Error(`It's not the turn of the player with the id ${userId}`);
    }

    const cards = R.pipe(
      R.prop("cardsByPlayer"),
      R.find(cardsByPlayer => cardsByPlayer.playerId.equals(userId)),
      R.prop("cards")
    )(currentRound);

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

    const currentRoundIndex = match.rounds.length - 1;

    if (currentRound.winner) {
      throw new Error("There is already a winner for the current round");
    }

    if (
      R.anyPass([
        R.pathEq(["truco", "status"], "PENDING"),
        R.pathEq(["envido", "status"], "PENDING")
      ])(currentRound)
    ) {
      throw new Error("Can't play card if truco or envido answer is pending");
    }

    const currentHandIndex = currentRound.hands.length - 1;
    const currentHand = R.last(currentRound.hands);

    const playersIds = R.map(player => player.data.toString(), match.players);
    const playerIndex = R.findIndex(R.equals(userId))(playersIds);

    const lastPlayerIndex =
      currentHand.initialPlayerIndex - 1 < 0
        ? match.playersCount - 1
        : currentHand.initialPlayerIndex - 1;
    const lastPlayerId = playersIds[lastPlayerIndex];
    const isLastPlayerOfHand = userId === lastPlayerId;
    const { handWinnerTeam, handStarterPlayerIndex } =
      isLastPlayerOfHand &&
      getHandTeamWinner(
        R.pipe(
          R.map(R.path(["cards", currentHandIndex, "card"])),
          R.map(R.when(R.isNil, R.always(selectedCard.card)))
        )(currentRound.cardsPlayedByPlayer)
      );

    const nextPlayerIndex =
      R.type(handStarterPlayerIndex) === "Number"
        ? handStarterPlayerIndex
        : R.pipe(
            R.inc,
            R.modulo(R.__, match.playersCount)
          )(playerIndex);

    const nextPlayerId = match.players[nextPlayerIndex].data;

    const handsWinnerTeam =
      isLastPlayerOfHand &&
      R.pipe(
        R.map(R.prop("winnerTeam")),
        R.filter(Boolean),
        R.append(handWinnerTeam)
      )(currentRound.hands);
    const roundWinnerTeam = getRoundWinnerTeam(handsWinnerTeam);

    const roundTrucoPoints = getRoundTrucoPoints(currentRound);

    const matchWinner =
      roundWinnerTeam &&
      getMatchWinnerTeam(match, roundWinnerTeam, roundTrucoPoints);

    const updatedMatch = R.pipe(
      match => match.toObject(),
      formatMatch,
      assocCardsPlayedByPlayers,
      assocNextPlayer
    )(
      await Match.findByIdAndUpdate(
        matchId,
        {
          $set: {
            [`rounds.${currentRoundIndex}.nextPlayer`]: nextPlayerId,
            [`rounds.${currentRoundIndex}.cardsByPlayer.${playerIndex}.cards.${selectedCardIndex}.played`]: true,
            [`rounds.${currentRoundIndex}.winner`]: roundWinnerTeam || null,
            ...(isLastPlayerOfHand && {
              [`rounds.${currentRoundIndex}.hands.${currentHandIndex}.winnerTeam`]: handWinnerTeam,
              [`rounds.${currentRoundIndex}.hands.${currentHandIndex + 1}`]: {
                initialPlayerIndex: nextPlayerIndex
              }
            }),
            ...(matchWinner && {
              winnerTeam: matchWinner
            })
          },
          ...(roundWinnerTeam && {
            $inc: {
              [roundWinnerTeam === "first"
                ? "pointsFirstTeam"
                : "pointsSecondTeam"]: roundTrucoPoints
            }
          }),
          $push: {
            [`rounds.${currentRoundIndex}.cardsPlayedByPlayer.${playerIndex}.cards`]: {
              id: cardId,
              card: selectedCard.card
            }
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
          ...R.pipe(
            assocCurrentPlayerCards(player.id),
            assocPoints(player.id),
            assocRoundWinnerTeam(player.id),
            assocIsLastPlayerFromTeam(player.id),
            assocMatchWinnerTeam(player.id),
            assocTrucoStatus(player.id),
            assocEnvidoStatus(player.id)
          )(updatedMatch),
          type: events.NEW_MOVE
        }
      });
    });

    // @todo => Send new round in same update and handle delay in front-end
    // If round is finished and match is not finished
    // add new round and send update after a delay
    if (roundWinnerTeam && !matchWinner) {
      (async () => {
        await delay(5000);

        const newRoundMatch = R.pipe(
          match => match.toObject(),
          formatMatch,
          assocCardsPlayedByPlayers,
          assocNextPlayer
        )(
          await Match.findByIdAndUpdate(
            matchId,
            {
              $push: {
                rounds: getNewRoundData(
                  R.map(R.prop("id"), updatedMatch.players)
                )
              }
            },
            {
              new: true
            }
          )
            .populate("creator")
            .populate("players.data")
        );

        newRoundMatch.players.forEach(player => {
          pubsub.publish(events.NEW_ROUND, {
            userId: player.id,
            matchUpdated: {
              ...R.pipe(
                assocCurrentPlayerCards(player.id),
                assocPoints(player.id),
                assocRoundWinnerTeam(player.id),
                assocIsLastPlayerFromTeam(player.id)
              )(newRoundMatch),
              type: events.NEW_ROUND
            }
          });
        });
      })();
    }

    return R.pipe(
      assocCurrentPlayerCards(userId),
      assocPoints(userId),
      assocRoundWinnerTeam(userId),
      assocMatchWinnerTeam(userId),
      assocIsLastPlayerFromTeam(userId)
    )(updatedMatch);
  }

  async playTruco({ matchId, userId, action }) {
    const match = await Match.findById(matchId);

    const actionError = validateMatchAction(matchId, match, userId);

    if (actionError) {
      throw new Error(actionError);
    }

    const currentRound = R.last(match.rounds);
    const currentRoundIndex = match.rounds.length - 1;
    const roundTruco = R.prop("truco")(currentRound);

    if (R.pathEq(["envido", "status"], "PENDING", currentRound)) {
      throw new Error("Can't play truco if envido is pending");
    }

    // Check if it's initial "truco" or if it's responding to truco from the other team
    const isAnswering = R.pipe(
      R.prop("status"),
      R.equals("PENDING")
    )(roundTruco);

    const isFromFirstTeam = R.pipe(
      R.find(player => player.data.equals(userId)),
      R.prop("isFromFirstTeam")
    )(match.players);

    if (!isAnswering && !currentRound.nextPlayer.equals(userId)) {
      throw new Error(`It's not the turn of the player with the id ${userId}`);
    }

    // Check that player answering is from the correct team
    if (
      isAnswering &&
      R.prop("isFromFirstTeam", roundTruco) === isFromFirstTeam
    ) {
      throw new Error(`It's time for the other team to respond`);
    }

    if (!isValidTrucoAction({ action, roundTruco })) {
      throw new Error(`The action ${action} is not valid.`);
    }

    const trucoRejected = action === "REJECT";

    const roundTrucoPoints =
      trucoRejected && getRoundTrucoPoints(currentRound) - 1;

    const matchWinner =
      trucoRejected &&
      getMatchWinnerTeam(
        match,
        isFromFirstTeam ? "second" : "first",
        roundTrucoPoints
      );

    const newType = R.cond([
      [
        R.anyPass([
          R.equals("TRUCO"),
          R.equals("RETRUCO"),
          R.equals("VALE_CUATRO")
        ]),
        R.always(action)
      ],
      [R.T, R.always(roundTruco.type)]
    ])(action);

    const newStatus = R.cond([
      [R.equals("ACCEPT"), R.always("ACCEPTED")],
      [R.equals("REJECT"), R.always("REJECTED")],
      [R.T, R.always("PENDING")]
    ])(action);

    // @todo -> Add new player index if game is finished

    const updatedMatch = R.pipe(
      match => match.toObject(),
      formatMatch,
      assocCardsPlayedByPlayers,
      assocNextPlayer
    )(
      await Match.findByIdAndUpdate(
        matchId,
        {
          $set: {
            [`rounds.${currentRoundIndex}.truco`]: {
              type: newType,
              status: newStatus,
              isFromFirstTeam,
              hand: R.pipe(
                R.prop("hands"),
                R.length
              )(currentRound)
            },
            ...(trucoRejected
              ? {
                  [`rounds.${currentRoundIndex}.winner`]: isFromFirstTeam
                    ? "second"
                    : "first"
                }
              : {}),
            ...(trucoRejected && !matchWinner
              ? {
                  [`rounds.${currentRoundIndex + 1}`]: getNewRoundData(
                    R.map(R.prop("data"), match.players)
                  )
                }
              : {}),
            ...(matchWinner && {
              winnerTeam: matchWinner
            })
          },
          ...(trucoRejected && {
            $inc: {
              [isFromFirstTeam
                ? "pointsSecondTeam"
                : "pointsFirstTeam"]: roundTrucoPoints
            }
          })
        },
        { new: true }
      )
        .populate("creator")
        .populate("players.data")
    );

    updatedMatch.players.forEach(player => {
      const result = {
        userId: player.id,
        matchUpdated: {
          ...R.pipe(
            assocCurrentPlayerCards(player.id),
            assocPoints(player.id),
            assocRoundWinnerTeam(player.id),
            assocTrucoStatus(player.id),
            assocEnvidoStatus(player.id),
            assocIsLastPlayerFromTeam(player.id)
          )(updatedMatch),
          type: events.TRUCO_ACTION
        }
      };
      pubsub.publish(events.TRUCO_ACTION, result);
    });

    return {
      success: true,
      message: "Match updated successfully"
    };
  }

  async playEnvido({ matchId, userId, action }) {
    const match = await Match.findById(matchId);

    const actionError = validateMatchAction(matchId, match, userId);

    if (actionError) {
      throw new Error(actionError);
    }

    const currentRound = R.last(match.rounds);
    const currentRoundIndex = match.rounds.length - 1;
    const roundEnvido = R.prop("envido")(currentRound);

    if (R.pathEq(["truco", "status"], "PENDING", currentRound)) {
      throw new Error("Can't play envido if truco is pending");
    }

    if (currentRound.hands.length > 1) {
      throw new Error(
        `You can't play envido after the first hand of the round.`
      );
    }

    const isAnswering = R.propEq("status", "PENDING")(roundEnvido);
    const isFromFirstTeam = R.pipe(
      R.find(player => player.data.equals(userId)),
      R.prop("isFromFirstTeam")
    )(match.players);

    if (
      !isAnswering &&
      !(
        currentRound.nextPlayer.equals(userId) &&
        isLastPlayerFromTeam(match, userId)
      )
    ) {
      throw new Error(
        `The player with the id ${userId} can't play envido now.`
      );
    }

    // Check that player answering is from the correct team
    if (
      isAnswering &&
      R.prop("isFromFirstTeam", roundEnvido) === isFromFirstTeam
    ) {
      throw new Error(`It's time for the other team to respond`);
    }

    if (!isValidEnvidoAction({ action, roundEnvido })) {
      throw new Error(`The action ${action} is not valid.`);
    }

    const isAccepted = action === "ACCEPT";
    const isRejected = action === "REJECT";

    const envidoPoints =
      (isAccepted || isRejected) &&
      getRoundEnvidoPoints({
        envidoList: R.propOr([], "list", roundEnvido),
        pointsFirstTeam: match.pointsFirstTeam,
        pointsSecondTeam: match.pointsSecondTeam,
        isAccepted
      });

    const envidoWinnerTeam = isAccepted && getEnvidoWinnerTeam(currentRound);

    const newEnvidoList = ["ACCEPT", "REJECT"].includes(action)
      ? roundEnvido.list
      : roundEnvido.list.concat(action);

    const newStatus = R.cond([
      [R.equals("ACCEPT"), R.always("ACCEPTED")],
      [R.equals("REJECT"), R.always("REJECTED")],
      [R.T, R.always("PENDING")]
    ])(action);

    const updatedMatch = R.pipe(
      match => match.toObject(),
      formatMatch,
      assocCardsPlayedByPlayers,
      assocNextPlayer
    )(
      await Match.findByIdAndUpdate(
        matchId,
        {
          $set: {
            [`rounds.${currentRoundIndex}.envido`]: {
              list: newEnvidoList,
              status: newStatus,
              isFromFirstTeam
            }
          },
          ...(isRejected && {
            $inc: {
              [isFromFirstTeam
                ? "pointsSecondTeam"
                : "pointsFirstTeam"]: envidoPoints
            }
          }),
          ...(isAccepted && {
            $inc: {
              [envidoWinnerTeam === "first"
                ? "pointsFirstTeam"
                : "pointsSecondTeam"]: envidoPoints
            }
          })
        },
        { new: true }
      )
        .populate("creator")
        .populate("players.data")
    );

    updatedMatch.players.forEach(player => {
      const result = {
        userId: player.id,
        matchUpdated: {
          ...R.pipe(
            assocCurrentPlayerCards(player.id),
            assocPoints(player.id),
            assocRoundWinnerTeam(player.id),
            assocTrucoStatus(player.id),
            assocEnvidoStatus(player.id),
            assocIsLastPlayerFromTeam(player.id)
          )(updatedMatch),
          type: events.ENVIDO_ACTION
        }
      };
      pubsub.publish(events.ENVIDO_ACTION, result);
    });

    return {
      success: true,
      message: "Match updated successfully"
    };
  }
}

module.exports = MatchAPI;
