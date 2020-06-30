import * as R from "ramda";

import { PlayerMatch, PlayerEnvidoPoints } from "../../../types/graphql";

// @todo -> Add tests for utilities

const getNextTrucoAction = (lastAction: string) => {
  if (!lastAction) return ["TRUCO"];
  if (lastAction === "TRUCO") return ["RETRUCO"];
  if (lastAction === "RETRUCO") return ["VALE_CUATRO"];
  return [];
};

export const getTrucoActions = (
  match: PlayerMatch,
  currentHand: number
): {
  isAnsweringTruco?: boolean;
  trucoActions?: string[];
} => {
  return R.cond([
    // Answer to truco action
    [
      R.both(R.propEq("status", "PENDING"), R.propEq("team", "them")),
      (truco) => ({
        isAnsweringTruco: true,
        trucoActions: [
          "ACCEPT",
          "REJECT",
          ...getNextTrucoAction(R.prop("type", truco)),
        ],
      }),
    ],
    // Play truco
    [
      R.anyPass([
        // If truco is not played yet
        R.isEmpty,
        // Or if it was accepted from our team in other hand
        R.allPass([
          R.propEq("status", "ACCEPTED"),
          R.propEq("team", "we"),
          ({ hand }) => hand !== currentHand,
        ]),
      ]),
      ({ type }) => ({
        trucoActions: [...getNextTrucoAction(type)],
      }),
    ],
    [R.T, R.always({})],
  ])(R.propOr({}, "truco", match));
};

// Get posible envido actions based on actions already played
const getEnvidoActionsFromList = (envidoList: string[]) => {
  const canPlayEnvido = !(
    envidoList.includes("REAL_ENVIDO") ||
    envidoList.includes("FALTA_ENVIDO") ||
    R.pipe(
      (envidoList: string[]) =>
        envidoList.filter((envidoItem) => envidoItem === "ENVIDO"),
      R.length,
      (timesEnvidoWasPlayed) => timesEnvidoWasPlayed >= 2
    )(envidoList)
  );
  const canPlayRealEnvido = !(
    envidoList.includes("REAL_ENVIDO") || envidoList.includes("FALTA_ENVIDO")
  );
  const canPlayFaltaEnvido = !envidoList.includes("FALTA_ENVIDO");

  return [
    ...(canPlayEnvido ? ["ENVIDO"] : []),
    ...(canPlayRealEnvido ? ["REAL_ENVIDO"] : []),
    ...(canPlayFaltaEnvido ? ["FALTA_ENVIDO"] : []),
  ];
};

export const getEnvidoActions = (
  match: PlayerMatch,
  currentHand: number
): { isAnsweringEnvido?: boolean; envidoActions?: string[] } => {
  return R.cond([
    // Answer to envido action
    [
      R.both(R.propEq("status", "PENDING"), R.propEq("team", "them")),
      (envido) => ({
        isAnsweringEnvido: true,
        envidoActions: [
          "ACCEPT",
          "REJECT",
          ...getEnvidoActionsFromList(R.propOr([], "list", envido)),
        ],
      }),
    ],
    // Play the first envido action of the match
    [
      (envido) =>
        !!(
          R.isEmpty(envido) &&
          match.isLastPlayerFromTeam &&
          currentHand === 1
        ),
      R.always({
        envidoActions: ["ENVIDO", "REAL_ENVIDO", "FALTA_ENVIDO"],
      }),
    ],
    [R.T, R.always({})],
  ])(R.propOr({}, "envido", match));
};

export const getSayEnvidoActions = ({
  envidoPoints = [],
  cardPlayed,
  currentPlayerEnvidoPoints,
  playersCount,
}: {
  envidoPoints?: PlayerEnvidoPoints[];
  cardPlayed: boolean;
  currentPlayerEnvidoPoints: number;
  playersCount: number;
}) => {
  const maxOponentEnvidoPoints = R.pipe(
    // Not sure why this works, revise
    // Related type error with filter https://github.com/DefinitelyTyped/DefinitelyTyped/issues/25581
    R.filter<any, "array">(R.propEq("team", "them")),
    R.pluck("points"),
    (points: number[]) => Math.max(...points),
    R.defaultTo(0)
  )(envidoPoints);

  const isLastPlayer = envidoPoints.length + 1 === playersCount;

  if (currentPlayerEnvidoPoints > maxOponentEnvidoPoints && isLastPlayer)
    return ["N_ARE_MORE"];

  if (currentPlayerEnvidoPoints <= maxOponentEnvidoPoints) {
    return ["CANT_WIN"];
  }

  return ["POINTS", ...(cardPlayed ? ["TABLE"] : [])];
};
