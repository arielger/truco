import React from "react";
import * as R from "ramda";

import ActionsList from "./ActionsList";
import {
  getEnvidoActions,
  getTrucoActions,
  getSayEnvidoActions
} from "./utils";

export default function Actions({
  client,
  match,
  matchId,
  isCurrentPlayer,
  currentHand,
  nextEnvidoPlayer,
  isCurrentEnvidoPlayer,
  envidoPoints,
  cardPlayed,
  currentPlayerEnvidoPoints,
  playersCount
}) {
  if (nextEnvidoPlayer && !isCurrentEnvidoPlayer) {
    return null;
  }

  if (isCurrentEnvidoPlayer) {
    const sayEnvidoActions = getSayEnvidoActions({
      envidoPoints,
      cardPlayed,
      currentPlayerEnvidoPoints,
      playersCount
    });

    return (
      <ActionsList
        matchId={matchId}
        client={client}
        envidoPoints={currentPlayerEnvidoPoints}
        sayEnvidoActions={sayEnvidoActions}
      />
    );
  }

  const { envidoOpponentAction, envidoActions } = getEnvidoActions(
    match,
    isCurrentPlayer,
    currentHand
  );

  const { trucoOpponentAction, trucoActions } = getTrucoActions(
    match,
    isCurrentPlayer,
    currentHand
  );

  const ourAction = R.cond([
    [
      R.both(
        R.pathEq(["envido", "team"], "we"),
        R.pathEq(["envido", "status"], "PENDING")
      ),
      R.pipe(
        R.path(["envido", "list"]),
        R.last
      )
    ],
    [
      R.both(
        R.pathEq(["truco", "team"], "we"),
        R.pathEq(["truco", "status"], "PENDING")
      ),
      R.path(["truco", "type"])
    ]
  ])({
    envido: R.propOr({}, "envido", match),
    truco: R.propOr({}, "truco", match)
  });

  if (
    !ourAction &&
    !(trucoActions && trucoActions.length) &&
    !(envidoActions && envidoActions.length)
  )
    return null;

  return (
    <ActionsList
      matchId={matchId}
      client={client}
      {...(ourAction
        ? { ourAction }
        : {
            theirAction: envidoOpponentAction || trucoOpponentAction,
            envidoActions: !trucoOpponentAction && envidoActions,
            trucoActions: !envidoOpponentAction && trucoActions
          })}
    />
  );
}
