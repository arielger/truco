import React from "react";
import * as R from "ramda";
import { Query, Mutation } from "react-apollo";
import { Prompt } from "react-router-dom";
import gql from "graphql-tag";

import styles from "./Match.module.scss";
import Card from "../../components/Card";

const matchFields = `
  status
  playersCount
  points
  creator {
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

const PLAY_CARD = gql`
  mutation playCard($matchId: ID!, $cardId: ID!) {
    playCard(matchId: $matchId, cardId: $cardId) {
      card
      played
    }
  }
`;

const MatchInner = ({ matchId, subscribeToUpdates, data, loading, error }) => {
  React.useEffect(() => {
    const unsubscribe = subscribeToUpdates();
    return () => {
      unsubscribe();
    };
  });

  if (loading) return <span>Loading</span>;
  if (error) return <span>Error</span>;

  return (
    <div>
      {data.match.status === "waiting" && (
        <div className={styles["waiting-container"]}>
          <h1>Partida de {data.match.creator.name}</h1>
          <h2>Esperando jugadores para comenzar la partida...</h2>
          <div className={styles["avatars"]}>
            {data.match.players.map(player => (
              <img
                key={player.id}
                className={styles["avatar"]}
                src={player.avatar}
                alt={`${player.name} avatar`}
              />
            ))}
            {Array(data.match.playersCount - data.match.players.length)
              .fill(undefined)
              .map((_, i) => (
                <div key={i} className={styles["avatar"]} />
              ))}
          </div>
        </div>
      )}
      {data.match.status === "playing" && (
        <div>
          <div className={styles["cards"]}>
            <Mutation mutation={PLAY_CARD}>
              {playCard =>
                R.reject(R.prop("played"))(data.match.myCards).map(
                  ({ id: cardId, card }) => (
                    <Card
                      onClick={() =>
                        playCard({ variables: { matchId, cardId } })
                      }
                      card={card}
                    />
                  )
                )
              }
            </Mutation>
          </div>
        </div>
      )}
    </div>
  );
};

export default function Match({ match }) {
  const matchId = match.params.matchId;

  React.useEffect(() => {
    // @todo: Join match when entering Match screen (so it's possible to share URL)
  }, []);

  return (
    <div>
      <Prompt message="Estas seguro que quieres abandonar la partida?" />
      <Query
        query={MATCH_QUERY}
        variables={{ id: matchId }}
        fetchPolicy="cache-and-network"
      >
        {({ subscribeToMore, ...result }) => (
          <MatchInner
            {...result}
            matchId={matchId}
            subscribeToUpdates={() =>
              subscribeToMore({
                document: MATCH_SUBSCRIPTION,
                variables: { matchId },
                updateQuery: (
                  prev,
                  {
                    subscriptionData: {
                      data: { matchUpdated }
                    }
                  }
                ) => {
                  console.log("matchUpdated:", matchUpdated);
                  return { ...prev, match: matchUpdated };
                }
              })
            }
          />
        )}
      </Query>
    </div>
  );
}
