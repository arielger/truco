import React from "react";
import { ApolloConsumer, Query, Subscription } from "react-apollo";
import gql from "graphql-tag";

const FETCH_MATCHES = gql`
  {
    matches {
      id
      playersCount
      points
      creator {
        name
      }
      players {
        id
      }
    }
  }
`;

const SUBSCRIBE_NEW_MATCHES = gql`
  subscription SubscribeNewMatches {
    matchAdded {
      playersCount
      id
      points
    }
  }
`;

const CREATE_MATCH = gql`
  mutation createMatch($playersCount: Int!, $points: Int!) {
    createMatch(playersCount: $playersCount, points: $points) {
      id
    }
  }
`;

export default function Matches() {
  return (
    <ApolloConsumer>
      {client => (
        <div>
          <h1>Matches</h1>
          <button
            onClick={() => {
              client
                .mutate({
                  variables: { playersCount: 2, points: 30 },
                  mutation: CREATE_MATCH
                })
                .then(response => {
                  console.log("New match:", response);
                  // @todo -> Redirect to new match page
                })
                .catch(error => {
                  console.log(error);
                });
            }}
          >
            Crear partido
          </button>
          <Query query={FETCH_MATCHES}>
            {({ loading, error, data }) => {
              if (loading) return <p>Loading...</p>;
              if (error) return <p>Error :(</p>;

              return (
                <ul>
                  {data.matches.map(match => (
                    <div key={match.id} style={{ border: "1px solid black" }}>
                      <h2>Partida de {match.creator.name}</h2>
                      <h3>Puntos: {match.points}</h3>
                      <h3>
                        Jugadores: {match.players.length}/{match.playersCount}
                      </h3>
                      <button>Unirse al partido</button>
                    </div>
                  ))}
                </ul>
              );
            }}
          </Query>
          <Subscription
            onSubscriptionData={d => console.log("subscription data:", d)}
            subscription={SUBSCRIBE_NEW_MATCHES}
          >
            {({ data, loading }) => (
              <div>
                Data: {JSON.stringify(data)}
                Loading: {JSON.stringify(loading)}
              </div>
            )}
          </Subscription>
        </div>
      )}
    </ApolloConsumer>
  );
}
