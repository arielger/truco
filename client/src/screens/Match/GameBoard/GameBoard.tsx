import * as R from "ramda";
import React from "react";

import YourCards from "../YourCards";
import OtherPlayer from "../OtherPlayer";
import PlayedCards from "../PlayedCards";
import Scores from "../Scores";
import Actions from "../Actions";
import WinnerModal from "../WinnerModal";

import { getEnvidoFromPlayer } from "../../../utils/envido";

const GameBoard = ({ match, user, matchId, history }) => {
  const notPlayedCards = R.pipe(
    R.propOr([], "myCards"),
    R.reject(R.prop("played"))
  )(match);

  const playedCards = R.pipe(
    R.find(R.propEq("playerId", user.id)),
    R.prop("cards"),
    R.defaultTo([])
  )(match.cardsPlayedByPlayer);

  const currentHand = playedCards.length + 1;

  const isCurrentPlayer = match.nextPlayer === user.id;

  const isCurrentEnvidoPlayer = match.nextPlayerEnvido === user.id;
  const currentPlayerEnvidoPoints =
    isCurrentEnvidoPlayer &&
    getEnvidoFromPlayer(match.myCards.map(({ card }) => card));

  const otherPlayers = R.reject(R.propEq("id", user.id), match.players);

  const waitingResponse =
    (R.pathEq(["envido", "team"], "we", match) &&
      R.pathEq(["envido", "status"], "PENDING", match)) ||
    (R.pathEq(["truco", "team"], "we", match) &&
      R.pathEq(["truco", "status"], "PENDING", match));
  const enablePlayCards =
    !match.roundWinnerTeam &&
    match.nextPlayer === user.id &&
    !match.nextPlayerEnvido &&
    !waitingResponse;

  return (
    <div className="w-screen h-screen relative overflow-hidden">
      <Scores
        moreThanTwoPlayers={match.players.length > 2}
        matchPoints={match.points}
        myPoints={match.myPoints}
        theirPoints={match.theirPoints}
      />
      <Actions
        match={match}
        matchId={matchId}
        waitingResponse={waitingResponse}
        isCurrentPlayer={isCurrentPlayer}
        nextEnvidoPlayer={match.nextPlayerEnvido}
        isCurrentEnvidoPlayer={isCurrentEnvidoPlayer}
        envidoPoints={match.envidoPoints}
        cardPlayed={!!playedCards.length}
        currentPlayerEnvidoPoints={currentPlayerEnvidoPoints}
        playersCount={match.playersCount}
        currentHand={currentHand}
      />
      <PlayedCards
        cardsPlayedByPlayer={match.cardsPlayedByPlayer}
        userId={user.id}
      />
      {otherPlayers.map((player) => (
        <OtherPlayer
          key={player.id}
          player={player}
          position="top" //@todo: Refactor to handle 4 and 6 players
          playedCards={R.pipe(
            R.find(R.propEq("playerId", player.id)),
            R.propOr([], "cards")
          )(match.cardsPlayedByPlayer)}
          isTheirTurn={
            match.nextPlayerEnvido
              ? player.id === match.nextPlayerEnvido
              : player.id === match.nextPlayer
          }
          action={
            R.pathEq(["lastAction", "playerId"], player.id, match) &&
            match.lastAction
          }
        />
      ))}
      <YourCards
        matchId={matchId}
        player={user}
        enablePlayCards={enablePlayCards}
        playedCards={playedCards}
        notPlayedCards={notPlayedCards}
        action={
          R.pathEq(["lastAction", "playerId"], user.id, match) &&
          match.lastAction
        }
      />
      {match.matchWinnerTeam && (
        <WinnerModal history={history} winnerTeam={match.matchWinnerTeam} />
      )}
    </div>
  );
};

export default GameBoard;
