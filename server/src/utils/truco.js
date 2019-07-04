const R = require("ramda");

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

const assocTrucoStatus = userId => match => {
  const { players } = match;
  const isFromFirstTeam = R.pipe(
    R.find(R.propEq("id", userId)),
    R.prop("isFromFirstTeam")
  )(players);
  const lastRound = R.last(match.rounds);
  const truco = R.prop("truco", lastRound);

  const result = R.when(
    R.always(truco),
    R.assoc("truco", {
      ...truco,
      team: R.prop("isFromFirstTeam", truco) === isFromFirstTeam ? "we" : "them"
    })
  )(match);

  return result;
};

module.exports = {
  isValidTrucoAction,
  getRoundTrucoPoints,
  assocTrucoStatus
};
