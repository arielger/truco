import * as R from "ramda";

const trucoActions = ["TRUCO", "RETRUCO", "VALE_CUATRO"];

export const getTrucoActions = lastAction =>
  R.pipe(
    act => R.findIndex(R.equals(act), trucoActions),
    R.inc,
    actionIndex => trucoActions[actionIndex]
  )(lastAction);

export const getEnvidoActions = envidoList => {
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
