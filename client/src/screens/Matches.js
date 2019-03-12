import React from "react";
import { withApollo, Query, Subscription } from "react-apollo";
import gql from "graphql-tag";
import NewMatch from "./NewMatch";

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

const Matches = ({ history, client }) => {
  const [isNewMatchModalVisible, setNewMatchModalVisible] = React.useState(
    false
  );

  const createNewMatch = matchData => {
    client
      .mutate({
        variables: matchData,
        mutation: CREATE_MATCH
      })
      .then(({ data: { createMatch: { id } } }) => {
        history.push(`/match/${id}`);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div>
      <h1>Matches</h1>
      <button onClick={() => setNewMatchModalVisible(true)}>
        Crear partido
      </button>
      <NewMatch
        visible={isNewMatchModalVisible}
        onClose={() => setNewMatchModalVisible(false)}
        onSubmit={createNewMatch}
      />
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
  );
};

export default withApollo(Matches);
