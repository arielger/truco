import React from "react";
import * as R from "ramda";
import { withApollo, useQuery } from "react-apollo";
import { Prompt } from "react-router-dom";
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

  const {
    loading,
    error,
    data,
    subscribeToMore: subscribeToMatchUpdates,
    client,
  } = useQuery(MATCH_QUERY, {
    variables: { id: matchId },
    fetchPolicy: "cache-and-network",
  });

  React.useEffect(() => {
    if (data && !loading && !error) {
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
          return { ...prev, match: matchUpdated };
        },
      });
      return () => {
        unsubscribe();
      };
    }
  }, [data, loading, error, matchId, subscribeToMatchUpdates]);

  // @TODO: Improve loading and error screens
  if (loading) {
    return (
      <div>
        <Spinner color="rgba(255,255,255, 0.5)" size="32px" />
        <span>Cargando partidas</span>
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
      <Prompt
        when={joinedMatch}
        message="Estas seguro que quieres abandonar la partida?"
      />
      {match.status === "waiting" ? (
        <WaitingState
          matchId={matchId}
          players={match.players}
          points={match.points}
          playersCount={match.playersCount}
          creator={match.creator}
          joinedMatch={joinedMatch}
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
