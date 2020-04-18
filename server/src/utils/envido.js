const R = require("ramda");

const isValidEnvidoAction = ({ action, roundEnvido }) => {
  const currentStatus = R.prop("status", roundEnvido);
  const envidoList = R.propOr([], "list", roundEnvido);

  const canPlayEnvido = !(
    envidoList.includes("REAL_ENVIDO") ||
    envidoList.includes("FALTA_ENVIDO") ||
    R.pipe(
      R.filter(R.equals("ENVIDO")),
      R.length,
      (timesEnvidoWasPlayed) => timesEnvidoWasPlayed >= 2
    )(envidoList)
  );
  const canPlayRealEnvido = !(
    envidoList.includes("REAL_ENVIDO") || envidoList.includes("FALTA_ENVIDO")
  );
  const canPlayFaltaEnvido = !envidoList.includes("FALTA_ENVIDO");

  const possibleActions = [
    ...(currentStatus === "PENDING" ? ["ACCEPT", "REJECT"] : []),
    ...(canPlayEnvido ? ["ENVIDO"] : []),
    ...(canPlayRealEnvido ? ["REAL_ENVIDO"] : []),
    ...(canPlayFaltaEnvido ? ["FALTA_ENVIDO"] : []),
  ];

  return possibleActions.includes(action);
};

const getRoundEnvidoPoints = ({
  envidoList,
  pointsFirstTeam,
  pointsSecondTeam,
  isAccepted,
}) => {
  /*
    Falta envido:
    Si ambos rivales están en las malas pues el que tiene más puntos
    gana el partido. Si estuviesen en las buenas o solamente uno de
    los rivales estuviese, entonces se adjudican los puntos que le
    faltan para ganar al que va venciendo
    */
  const teamsInMalas = pointsFirstTeam < 15 && pointsSecondTeam < 15;

  const faltaEnvidoPoints = teamsInMalas
    ? 30
    : 30 - Math.max(pointsFirstTeam, pointsSecondTeam);

  return R.pipe(
    // If envido is rejected remove last envido item to count points
    R.when(R.always(!isAccepted), R.init),
    R.reduce((totalPoints, envidoItem) => {
      const itemPoints = {
        ENVIDO: 2,
        REAL_ENVIDO: 3,
        FALTA_ENVIDO: faltaEnvidoPoints,
      }[envidoItem];

      return totalPoints + itemPoints;
    }, 0),
    (totalPoints) => Math.max(totalPoints, 1)
  )(envidoList);
};

const assocEnvidoStatus = (userId) => (match) => {
  const { players } = match;
  const isFromFirstTeam = R.pipe(
    R.find(R.propEq("id", userId)),
    R.prop("isFromFirstTeam")
  )(players);
  const lastRound = R.last(match.rounds);
  const envido = R.prop("envido", lastRound);

  return R.pipe(
    R.ifElse(
      () => R.pipe(R.propOr([], "list"), R.length)(envido),
      R.assoc("envido", {
        ...envido,
        team:
          R.prop("isFromFirstTeam", envido) === isFromFirstTeam ? "we" : "them",
      }),
      R.dissoc("envido")
    ),
    R.assoc("nextPlayerEnvido", R.prop("nextPlayerEnvido", lastRound)),
    R.assoc(
      "envidoPoints",
      R.pipe(
        R.propOr([], "envidoPoints"),
        R.map((playerEnvido) =>
          R.assoc(
            "team",
            playerEnvido.isFromFirstTeam === isFromFirstTeam ? "we" : "them",
            playerEnvido
          )
        )
      )(lastRound)
    )
  )(match);
};

const getCardNumber = (card) => Number(card.split("-")[0]);
const getCardStep = (card) => card.split("-")[1];

const getPointsBySet = (cards) => {
  const twoCardsBonus = cards.length >= 2 ? 20 : 0;
  const orderedCards = R.pipe(
    R.sort(
      R.descend((card) => {
        const cardNumber = getCardNumber(card);
        return cardNumber > 7 ? 0 : cardNumber;
      })
    ),
    R.take(2)
  )(cards);

  return orderedCards.reduce((total, card) => {
    const cardNumber = getCardNumber(card);
    return total + (cardNumber > 7 ? 0 : cardNumber);
  }, twoCardsBonus);
};

const getEnvidoFromPlayer = (cards) => {
  return R.pipe(
    R.groupBy(getCardStep),
    R.values,
    R.map(getPointsBySet),
    (points) => Math.max(...points)
  )(cards);
};

const getEnvidoWinnerTeam = (envidoByPlayer) => {
  return R.pipe(R.pluck("points"), (points) => {
    const maxPoints = Math.max(...points.filter(Boolean)); // Remove undefined values
    const winnerPlayerIndex = R.findIndex(R.equals(maxPoints), points);
    const isWinnerFromFirstTeam =
      envidoByPlayer[winnerPlayerIndex].isFromFirstTeam;
    return isWinnerFromFirstTeam ? "first" : "second";
  })(envidoByPlayer);
};

module.exports = {
  isValidEnvidoAction,
  getRoundEnvidoPoints,
  assocEnvidoStatus,
  getEnvidoFromPlayer,
  getEnvidoWinnerTeam,
};
