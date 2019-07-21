import React from "react";
import * as R from "ramda";
import { withApollo, Query } from "react-apollo";
import gql from "graphql-tag";

import NewMatch from "../NewMatch";
import MatchesList from "../../components/MatchesList";
import styles from "./Matches.module.scss";

const MATCHES_QUERY = gql`
  query matchesQuery {
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
    matchListUpdated {
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

const handleMatchUpdates = (
  prev,
  {
    subscriptionData: {
      data: { matchListUpdated }
    }
  }
) => {
  const { type, ...matchData } = matchListUpdated;
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
        {({ subscribeToMore, loading, error, data }) => {
          return (
            <MatchesList
              loading={loading}
              error={error}
              matches={data.matches}
              subscribeToUpdates={() =>
                subscribeToMore({
                  document: MATCHES_SUBSCRIPTION,
                  updateQuery: handleMatchUpdates
                })
              }
            />
          );
        }}
      </Query>
    </div>
  );
};

export default withApollo(Matches);
