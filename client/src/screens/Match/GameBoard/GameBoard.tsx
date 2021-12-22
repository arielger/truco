import * as R from "ramda";
import React from "react";
import YourCards from "../YourCards";
import OtherPlayer, {
  Position as OtherPlayerPosition,
} from "../OtherPlayer/OtherPlayer";
import PlayedCards from "../PlayedCards";
import Scores from "../Scores";
import Actions from "../Actions";
import WinnerModal from "../WinnerModal";

import { getEnvidoFromPlayer } from "../../../utils/envido";

import { PlayerMatch, User } from "../../../types/graphql";

type Props = {
  match: PlayerMatch;
  user: User;
  matchId: string;
};

const GameBoard = ({ match, user, matchId }: Props) => {
  const notPlayedCards = match.myCards.filter((card) => card.played === false);

  const playedCards =
    match.cardsPlayedByPlayer.find(R.propEq("playerId", user.id))?.cards || [];

  const currentHand = playedCards.length + 1;

  const isCurrentPlayer = match.nextPlayer === user.id;

  const isCurrentEnvidoPlayer = match.nextPlayerEnvido === user.id;
  const currentPlayerEnvidoPoints = isCurrentEnvidoPlayer
    ? getEnvidoFromPlayer(match.myCards.map(({ card }) => card))
    : 0; // We use 0 here just prevent Typescript from throwing a warning

  const otherPlayers = match.players.filter((userN) => userN.id !== user.id);

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
        myPoints={match.myPoints}
        theirPoints={match.theirPoints}
      />
      <Actions
        match={match}
        matchId={matchId}
        waitingResponse={waitingResponse}
        isCurrentPlayer={isCurrentPlayer}
        nextPlayerEnvido={match.nextPlayerEnvido}
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
          position={OtherPlayerPosition.Top} //@todo: Refactor to handle 4 and 6 players
          playedCards={
            match.cardsPlayedByPlayer.find(
              (cardsByPlayer) => cardsByPlayer.playerId === player.id
            )?.cards || []
          }
          isTheirTurn={
            match.nextPlayerEnvido
              ? player.id === match.nextPlayerEnvido
              : player.id === match.nextPlayer
          }
          action={
            match?.lastAction?.playerId === player.id
              ? match.lastAction
              : undefined
          }
        />
      ))}
      <YourCards
        matchId={matchId}
        enablePlayCards={enablePlayCards}
        notPlayedCards={notPlayedCards}
        action={
          match?.lastAction?.playerId === user.id ? match.lastAction : undefined
        }
      />
      {match.matchWinnerTeam && (
        <WinnerModal winnerTeam={match.matchWinnerTeam} />
      )}
    </div>
  );
};

export default GameBoard;
