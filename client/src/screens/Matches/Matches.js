import React from "react";
import * as R from "ramda";
import { useQuery, gql } from "@apollo/client";

import Button from "../../components/Button";

import NewMatch from "../NewMatch";
import MatchesList from "../../components/MatchesList";

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
      data: { matchListUpdated },
    },
  }
) => {
  const { type, ...matchData } = matchListUpdated;
  switch (type) {
    case "MATCH_ADDED": {
      return {
        ...prev,
        matches: [...prev.matches, matchData],
      };
    }
    case "MATCH_UPDATED": {
      return {
        ...prev,
        matches: prev.matches.map((match) =>
          matchData.id === match.id ? matchData : match
        ),
      };
    }
    case "MATCH_REMOVED": {
      return {
        ...prev,
        matches: R.reject(R.propEq("id", matchData.id))(prev.matches),
      };
    }
    default: {
      console.error("Invalid updateMatch type: ", type);
      return prev;
    }
  }
};

const Matches = ({ history }) => {
  const [isNewMatchModalVisible, setNewMatchModalVisible] = React.useState(
    false
  );

  const {
    loading,
    error,
    data: matchesData,
    subscribeToMore,
  } = useQuery(MATCHES_QUERY, { fetchPolicy: "cache-and-network" });

  return (
    <div className="flex flex-col p-6 items-center items-stretch w-full md:max-w-md mx-auto">
      <h1 className="text-3xl font-medium mb-8">Partidas</h1>
      <Button
        styleType="primary"
        className="mb-8"
        onClick={() => setNewMatchModalVisible(true)}
      >
        Crear nueva
      </Button>
      <NewMatch
        visible={isNewMatchModalVisible}
        onClose={() => setNewMatchModalVisible(false)}
        history={history}
      />
      <MatchesList
        loading={loading}
        error={error}
        matches={R.propOr([], "matches", matchesData)}
        subscribeToUpdates={() =>
          subscribeToMore({
            document: MATCHES_SUBSCRIPTION,
            updateQuery: handleMatchUpdates,
          })
        }
      />
    </div>
  );
};

export default Matches;
