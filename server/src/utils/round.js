const R = require("ramda");
const pickRandom = require("pick-random");
const { cards } = require("./cards");

const getPlayersInPlayingOrder = initialPlayerIndex => players => [
  ...players.slice(initialPlayerIndex),
  ...players.slice(0, initialPlayerIndex)
];

const getNewRoundData = (playersIds, lastRoundInitialPlayerIndex = -1) => {
  const playersCards = R.pipe(
    R.map(({ card }) => ({ card, played: false })),
    R.splitEvery(3)
  )(pickRandom(cards, { count: playersIds.length * 3 }));

  const initialPlayerIndex =
    (lastRoundInitialPlayerIndex + 1) % playersIds.length;

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
        initialPlayerIndex
      }
    ],
    nextPlayer: playersIds[initialPlayerIndex]
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

const isLastPlayerFromTeam = (match, userId) => {
  if (!match.rounds.length) return false;

  const currentHand = R.pipe(
    R.last,
    R.prop("hands"),
    R.last
  )(match.rounds);

  return R.pipe(
    getPlayersInPlayingOrder(currentHand.initialPlayerIndex),
    // Get only last player from each team
    players => players.slice(-2),
    R.map(({ id, data }) => (data ? data.toString() : id)),
    R.includes(userId)
  )(match.players);
};

module.exports = {
  getPlayersInPlayingOrder,
  getNewRoundData,
  getRoundWinnerTeam,
  getMatchWinnerTeam,
  isLastPlayerFromTeam
};
