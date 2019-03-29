const R = require("ramda");
const pickRandom = require("pick-random");
const { cards } = require("./cards");

const getNewRoundData = playersIds => {
  const playersCards = R.pipe(
    R.map(({ card }) => ({ card, played: false })),
    R.splitEvery(3)
  )(pickRandom(cards, { count: playersIds.length * 3 }));

  return {
    moves: [],
    cardsByPlayer: playersIds.map((playerId, i) => ({
      playerId,
      cards: playersCards[i]
    })),
    cardsPlayedByPlayer: playersIds.map(playerId => ({
      playerId,
      cards: []
    })),
    hands: [
      {
        initialPlayerIndex: 0
      }
    ],
    nextPlayer: R.head(playersIds)
  };
};

const isTeamWinner = (handsResults, team, isFirstTeam) =>
  R.anyPass([
    // If the team won 2 or more hands
    R.pipe(
      R.filter(R.equals(team)),
      R.length,
      winningRounds => winningRounds >= 2
    ),
    // If there is one tie and won 1 hand
    R.both(R.find(R.equals("tie")), R.find(R.equals(team))),
    // If it's the first team and all hands are a tie
    R.both(R.always(isFirstTeam), R.equals(["tie", "tie", "tie"]))
  ])(handsResults);

const getRoundWinnerTeam = handsResults => {
  if (isTeamWinner(handsResults, "first", true)) {
    return "first";
  }
  if (isTeamWinner(handsResults, "second")) {
    return "second";
  }
  return false;
};

const trucoActions = ["TRUCO", "RETRUCO", "VALE_CUATRO"];

const isValidTrucoAction = ({ action, roundTruco }) => {
  const currentStatus = R.prop("status", roundTruco);
  const currentAction = R.prop("type", roundTruco);

  const nextPossibleAction = R.pipe(
    act => R.findIndex(R.equals(act), trucoActions),
    R.inc,
    actionIndex => trucoActions[actionIndex]
  )(currentAction);

  return R.anyPass([
    R.allPass([
      R.always(currentStatus === "PENDING"),
      R.anyPass([
        R.equals("ACCEPT"),
        R.equals("REJECT"),
        R.equals(nextPossibleAction)
      ])
    ]),
    R.allPass([
      R.always(!currentStatus || currentStatus === "ACCEPTED"),
      R.equals(nextPossibleAction)
    ])
  ])(action);
};

const getRoundTrucoPoints = round =>
  R.pipe(
    R.path(["truco", "type"]),
    type =>
      ({
        TRUCO: 2,
        RETRUCO: 3,
        VALE_CUATRO: 4
      }[type]),
    R.defaultTo(1)
  )(round);

const getMatchWinnerTeam = (match, roundWinnerTeam, trucoPoints) => {
  const { pointsFirstTeam, pointsSecondTeam } = match;

  if (
    roundWinnerTeam === "first" &&
    pointsFirstTeam + trucoPoints >= match.points
  ) {
    return "first";
  }
  if (
    roundWinnerTeam === "second" &&
    pointsSecondTeam + trucoPoints >= match.points
  ) {
    return "second";
  }
  return false;
};

module.exports = {
  getNewRoundData,
  getRoundWinnerTeam,
  getMatchWinnerTeam,
  isValidTrucoAction,
  getRoundTrucoPoints
};
