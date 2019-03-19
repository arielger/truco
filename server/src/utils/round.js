const R = require("ramda");

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

module.exports = getRoundWinnerTeam;
