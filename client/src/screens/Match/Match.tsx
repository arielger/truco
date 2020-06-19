import React from "react";
import * as R from "ramda";
import { useQuery, gql } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrownOpen } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

import WaitingState from "./WaitingState";
import GameBoard from "./GameBoard";

import Button from "../../components/Button";
import Spinner from "../../components/Spinner";

const matchFields = `
  status
  playersCount
  points
  creator {
    id
    name
    avatar
  }
  players {
    id
    name
    avatar
  }
  myCards {
    id
    card
    played
  }
  cardsPlayedByPlayer {
    playerId
    cards
  }
  nextPlayer
  isLastPlayerFromTeam
  myPoints
  theirPoints
  roundWinnerTeam
  matchWinnerTeam
  truco {
    type
    status
    team
    hand
  }
  envido {
    list
    status
    team
  }
  nextPlayerEnvido
  envidoPoints {
    playerId
    moveType
    points
    team
  }
  lastAction {
    playerId
    type
    points
  }
`;

const MATCH_QUERY = gql`
  query matchQuery($id: ID!) {
    match(id: $id) {
      ${matchFields}
    }
  }
`;

const MATCH_SUBSCRIPTION = gql`
  subscription matchUpdated($matchId: ID!) {
    matchUpdated(matchId: $matchId) {
      type
      ${matchFields}
    }
  }
`;

function Match({ history, user, match: urlMatch }) {
  const matchId = urlMatch.params.matchId;

  const [showCreatorLeft, setShowCreatorLeft] = React.useState(false);

  const {
    loading,
    error,
    data,
    subscribeToMore: subscribeToMatchUpdates,
    client,
  } = useQuery(MATCH_QUERY, {
    variables: { id: matchId },
    fetchPolicy: "network-only",
  });

  React.useEffect(() => {
    console.log("Subscribe to match updates");
    const unsubscribe = subscribeToMatchUpdates({
      document: MATCH_SUBSCRIPTION,
      variables: { matchId },
      // @TODO: Check if we need to update the whole match object for each update
      updateQuery: (
        prev,
        {
          subscriptionData: {
            data: { matchUpdated },
          },
        }
      ) => {
        console.log("matchUpdated:", matchUpdated);

        if (R.propEq("type", "CREATOR_LEFT_GAME", matchUpdated)) {
          setShowCreatorLeft(true);
        }

        return { ...prev, match: matchUpdated };
      },
    });
    return () => {
      unsubscribe();
    };
  }, [matchId, subscribeToMatchUpdates]);

  // @TODO: Improve loading and error screens
  if (loading) {
    return <Spinner fullHeight text="Cargando partida" />;
  }
  if (error)
    return (
      <div className="h-full flex flex-col justify-center items-center p-4">
        <div className="flex flex-col justify-center items-center text-center flex-1">
          <FontAwesomeIcon icon={faFrownOpen} className="text-4xl mb-4" />
          <span className="mb-2">Hubo un error al cargar la partida</span>
          <span className="text-sm text-gray-500">
            Estás seguro que ingresaste el código correcto?
          </span>
        </div>
        <Link to="/partidas" className="w-full">
          <Button styleType="primary">Volver al listado de partidas</Button>
        </Link>
      </div>
    );

  const match = R.propOr({}, "match", data);

  const joinedMatch = R.pipe(
    R.pluck("id"),
    R.includes(user.id)
  )(match.players || []);

  return (
    <>
      {match.status === "waiting" ? (
        <WaitingState
          userId={user.id}
          matchId={matchId}
          players={match.players}
          points={match.points}
          playersCount={match.playersCount}
          creator={match.creator}
          isCreator={user.id === match.creator.id}
          joinedMatch={joinedMatch}
          showCreatorLeft={showCreatorLeft}
        />
      ) : match.status === "playing" ? (
        <GameBoard
          match={match}
          client={client}
          user={user}
          matchId={matchId}
          history={history}
        />
      ) : match.status === "finished" ? (
        <span>La partida ya ha finalizado.</span>
      ) : null}
    </>
  );
}

export default Match;
