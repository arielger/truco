import * as R from "ramda";

// @todo -> Add tests for utilities

const getNextTrucoAction = lastAction => {
  if (!lastAction) return ["TRUCO"];
  if (lastAction === "TRUCO") return ["RETRUCO"];
  if (lastAction === "RETRUCO") return ["VALE_CUATRO"];
  return [];
};

export const getTrucoActions = (match, isCurrentPlayer, currentHand) => {
  return R.cond([
    // Answer to truco action
    [
      R.both(R.propEq("status", "PENDING"), R.propEq("team", "them")),
      truco => ({
        trucoOpponentAction: R.prop("type", truco),
        trucoActions: [
          "ACCEPT",
          "REJECT",
          ...getNextTrucoAction(R.prop("type", truco))
        ]
      })
    ],
    // Play truco
    [
      R.allPass([
        R.always(isCurrentPlayer),
        R.anyPass([
          // If truco is not played yet
          R.isEmpty,
          // Or if it was accepted from our team in other hand
          R.allPass([
            R.propEq("status", "ACCEPTED"),
            R.propEq("team", "we"),
            ({ hand }) => hand !== currentHand
          ])
        ])
      ]),
      ({ type }) =>
        R.tap(x => console.log("x", x))({
          trucoActions: [...getNextTrucoAction(type)]
        })
    ],
    [R.T, R.always({})]
  ])(R.propOr({}, "truco", match));
};

const getEnvidoActionsFromList = envidoList => {
  const canPlayEnvido = !(
    envidoList.includes("REAL_ENVIDO") ||
    envidoList.includes("FALTA_ENVIDO") ||
    R.pipe(
      R.filter(R.equals("ENVIDO")),
      R.length,
      timesEnvidoWasPlayed => timesEnvidoWasPlayed >= 2
    )(envidoList)
  );
  const canPlayRealEnvido = !(
    envidoList.includes("REAL_ENVIDO") || envidoList.includes("FALTA_ENVIDO")
  );
  const canPlayFaltaEnvido = !envidoList.includes("FALTA_ENVIDO");

  return [
    ...(canPlayEnvido ? ["ENVIDO"] : []),
    ...(canPlayRealEnvido ? ["REAL_ENVIDO"] : []),
    ...(canPlayFaltaEnvido ? ["FALTA_ENVIDO"] : [])
  ];
};

export const getEnvidoActions = (match, isCurrentPlayer, currentHand) => {
  return R.cond([
    // Answer to envido action
    [
      R.both(R.propEq("status", "PENDING"), R.propEq("team", "them")),
      envido => ({
        envidoOpponentAction: R.pipe(
          R.prop("list"),
          R.last
        )(envido),
        envidoActions: [
          "ACCEPT",
          "REJECT",
          ...getEnvidoActionsFromList(R.propOr([], "list", envido))
        ]
      })
    ],
    // Play the first envido action of the match
    [
      envido =>
        R.isEmpty(envido) &&
        isCurrentPlayer &&
        match.isLastPlayerFromTeam &&
        currentHand === 1,
      R.always({
        envidoActions: ["ENVIDO", "REAL_ENVIDO", "FALTA_ENVIDO"]
      })
    ],
    [R.T, R.always({})]
  ])(R.propOr({}, "envido", match));
};
