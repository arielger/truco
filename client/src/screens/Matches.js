import React from "react";
import * as R from "ramda";
import { withApollo, Query, Mutation } from "react-apollo";
import { Redirect } from "react-router-dom";
import gql from "graphql-tag";
import NewMatch from "./NewMatch";

const MATCHES_QUERY = gql`
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

const MATCHES_SUBSCRIPTION = gql`
  subscription SubscribeNewMatches {
    matchUpdated {
      id
      playersCount
      points
      type
      creator {
        name
      }
      players {
        id
      }
    }
  }
`;

const JOIN_MATCH = gql`
  mutation joinMatch($matchId: ID!) {
    joinMatch(matchId: $matchId) {
      id
    }
  }
`;

const handleMatchUpdates = (
  prev,
  {
    subscriptionData: {
      data: { matchUpdated }
    }
  }
) => {
  console.log("matchUpdated:", matchUpdated);
  const { type, ...matchData } = matchUpdated;
  switch (type) {
    case "NEW_MATCH": {
      return {
        ...prev,
        matches: [...prev.matches, matchData]
      };
    }
    case "UPDATED_MATCH": {
      return {
        ...prev,
        matches: R.when(R.propEq("id", matchData.id), R.mergeLeft(matchData))(
          prev.matches
        )
      };
    }
    case "DELETED_MATCH": {
      return {
        ...prev,
        matches: R.reject(R.propEq("id", matchData.id))(prev.matches)
      };
    }
    default: {
      console.error("Invalid updateMatch type: ", type);
      return prev;
    }
  }
};

const Matches = ({ history, client }) => {
  const [isNewMatchModalVisible, setNewMatchModalVisible] = React.useState(
    false
  );

  return (
    <div>
      <h1>Matches</h1>
      <button onClick={() => setNewMatchModalVisible(true)}>
        Crear partido
      </button>
      <NewMatch
        visible={isNewMatchModalVisible}
        onClose={() => setNewMatchModalVisible(false)}
        history={history}
        client={client}
      />
      <Query query={MATCHES_QUERY} fetchPolicy="cache-and-network">
        {({ subscribeToMore, ...result }) => (
          <MatchesList
            {...result}
            subscribeToUpdates={() => {
              subscribeToMore({
                document: MATCHES_SUBSCRIPTION,
                updateQuery: handleMatchUpdates
              });
            }}
          />
        )}
      </Query>
    </div>
  );
};

const MatchesList = ({ subscribeToUpdates, data, loading, error }) => {
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  React.useEffect(() => {
    subscribeToUpdates();
  }, []);

  return (
    <ul>
      {data.matches.map(match => (
        <div key={match.id} style={{ border: "1px solid black" }}>
          <h2>Partida de {match.creator.name}</h2>
          <h3>Puntos: {match.points}</h3>
          <h3>
            Jugadores: {match.players.length}/{match.playersCount}
          </h3>
          <Mutation mutation={JOIN_MATCH}>
            {(joinMatch, { data, loading, error }) =>
              data ? (
                <Redirect push to={`/match/${data.joinMatch.id}`} />
              ) : (
                <button
                  onClick={() => {
                    joinMatch({ variables: { matchId: match.id } });
                  }}
                >
                  Unirse al partido
                </button>
              )
            }
          </Mutation>
        </div>
      ))}
    </ul>
  );
};

export default withApollo(Matches);
