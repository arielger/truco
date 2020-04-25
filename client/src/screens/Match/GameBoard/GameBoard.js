import * as R from "ramda";
import React from "react";

import PlayerCards from "../PlayerCards";
import PlayedCards from "../PlayedCards";
import Scores from "../Scores";
import Actions from "../Actions";
import WinnerModal from "../WinnerModal";

import { getEnvidoFromPlayer } from "../../../utils/envido";

const GameBoard = ({ match, client, user, matchId, history }) => {
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

  return (
    <div>
      <Scores
        moreThanTwoPlayers={match.players.length > 2}
        matchPoints={match.points}
        myPoints={match.myPoints}
        theirPoints={match.theirPoints}
      />
      <Actions
        client={client}
        match={match}
        matchId={matchId}
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
        <PlayerCards
          key={player.id}
          action={
            R.pathEq(["lastAction", "playerId"], player.id, match) &&
            match.lastAction
          }
          player={player}
          isTheirTurn={
            match.nextPlayerEnvido
              ? player.id === match.nextPlayerEnvido
              : player.id === match.nextPlayer
          }
          position="top" //@todo: Refactor to handle 4 and 6 players
          playedCards={R.pipe(
            R.find(R.propEq("playerId", player.id)),
            R.propOr([], "cards")
          )(match.cardsPlayedByPlayer)}
        />
      ))}
      <PlayerCards
        client={client}
        matchId={matchId}
        player={user}
        action={
          R.pathEq(["lastAction", "playerId"], user.id, match) &&
          match.lastAction.type
        }
        isTheirTurn={
          match.nextPlayerEnvido ? isCurrentEnvidoPlayer : isCurrentPlayer
        }
        position="bottom"
        isCurrentUser={true}
        enablePlayCards={
          !match.roundWinnerTeam &&
          match.nextPlayer === user.id &&
          !match.nextPlayerEnvido
        }
        playedCards={playedCards}
        notPlayedCards={notPlayedCards}
      />
      {match.matchWinnerTeam && (
        <WinnerModal history={history} winnerTeam={match.matchWinnerTeam} />
      )}
    </div>
  );
};

export default GameBoard;
