import React from "react";
import * as R from "ramda";
import { withApollo, useQuery } from "react-apollo";
import Spinner from "react-svg-spinner";
import gql from "graphql-tag";

import WaitingState from "./WaitingState";
import GameBoard from "./GameBoard";

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
    return (
      <div className="flex flex-col space-y-4 items-center justify-center h-screen">
        <Spinner color="rgba(255,255,255, 0.5)" size="32px" />
        <span>Cargando partida</span>
      </div>
    );
  }
  if (error) return <p>Error</p>;

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

export default withApollo(Match);
