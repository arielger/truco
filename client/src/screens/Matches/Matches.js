import React from "react";
import * as R from "ramda";
import { withApollo, Query, Mutation } from "react-apollo";
import { Redirect } from "react-router-dom";
import gql from "graphql-tag";
import NewMatch from "../NewMatch";
import styles from "./Matches.module.scss";

const MATCHES_QUERY = gql`
  {
    matches {
      id
      playersCount
      points
      creator {
        name
        avatar
      }
      players {
        name
        avatar
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
        avatar
      }
      players {
        name
        avatar
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
        matches: prev.matches.map(match =>
          matchData.id === match.id ? matchData : match
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
    <div className={styles["main"]}>
      <div className={styles["header"]}>
        <h1>Mesas</h1>
        <button onClick={() => setNewMatchModalVisible(true)}>
          Crear mesa
        </button>
      </div>
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
            subscribeToUpdates={() =>
              subscribeToMore({
                document: MATCHES_SUBSCRIPTION,
                updateQuery: handleMatchUpdates
              })
            }
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
    const unsubscribe = subscribeToUpdates();
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <ul className={styles["matches"]}>
      {data.matches.map(match => (
        <Mutation key={match.id} mutation={JOIN_MATCH}>
          {(joinMatch, { data, loading, error }) =>
            data ? (
              <Redirect push to={`/match/${data.joinMatch.id}`} />
            ) : (
              <div
                onClick={() => {
                  joinMatch({ variables: { matchId: match.id } });
                }}
                className={styles["match"]}
                key={match.id}
              >
                <img
                  className={styles["creator-avatar"]}
                  src={match.creator.avatar}
                  alt={`${match.creator.name} avatar`}
                />
                <h2>{match.creator.name}</h2>
                <h3>A {match.points} puntos</h3>
                <div>
                  Jugadores: {match.players.length}/{match.playersCount}
                  <div className={styles["avatars"]}>
                    {match.players.map(player => (
                      <img
                        key={player.name}
                        className={styles["player-avatar"]}
                        src={player.avatar}
                        alt={`${player.name} avatar`}
                      />
                    ))}
                    {Array(match.playersCount - match.players.length)
                      .fill(undefined)
                      .map((_, i) => (
                        <div key={i} className={styles["no-player-avatar"]} />
                      ))}
                  </div>
                </div>
              </div>
            )
          }
        </Mutation>
      ))}
    </ul>
  );
};

export default withApollo(Matches);
