import React from "react";
import * as R from "ramda";
import { gql } from "@apollo/client";

import { trackModalView } from "../../components/UserTracking";
import Button from "../../components/Button";

import NewMatch from "../NewMatch";
import MatchesList from "../../components/MatchesList";

import {
  useFetchMatchesQuery,
  SubscribeNewMatchesSubscription,
  SubscribeNewMatchesSubscriptionVariables,
  MatchListUpdateType,
} from "../../types/graphql";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MATCHES_QUERY = gql`
  query fetchMatches {
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
      type
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

const Matches = () => {
  const [isNewMatchModalVisible, setNewMatchModalVisible] = React.useState(
    false
  );

  const {
    loading,
    error,
    data: matchesData,
    subscribeToMore: subscribeToMatchListUpdates,
  } = useFetchMatchesQuery({ fetchPolicy: "cache-and-network" });

  return (
    <div className="flex flex-col p-6 items-center items-stretch w-full md:max-w-md mx-auto">
      <h1 className="text-3xl font-medium mb-8">Partidas</h1>
      <Button
        styleType="primary"
        className="mb-8"
        onClick={() => {
          setNewMatchModalVisible(true);
          trackModalView("/partidas/crear-nueva");
        }}
      >
        Crear nueva
      </Button>
      <NewMatch
        visible={isNewMatchModalVisible}
        onClose={() => setNewMatchModalVisible(false)}
      />
      <MatchesList
        loading={loading}
        error={error}
        matches={R.propOr([], "matches", matchesData)}
        subscribeToUpdates={() =>
          subscribeToMatchListUpdates<
            SubscribeNewMatchesSubscription,
            SubscribeNewMatchesSubscriptionVariables
          >({
            document: MATCHES_SUBSCRIPTION,
            updateQuery: (prev, { subscriptionData }) => {
              const {
                type,
                ...matchData
              } = subscriptionData?.data?.matchListUpdated;

              switch (type) {
                case MatchListUpdateType.MatchAdded: {
                  return {
                    ...prev,
                    matches: [...prev.matches, matchData],
                  };
                }
                case MatchListUpdateType.MatchUpdated: {
                  return {
                    ...prev,
                    matches: prev.matches.map((match) =>
                      matchData.id === match?.id ? matchData : match
                    ),
                  };
                }
                case MatchListUpdateType.MatchRemoved: {
                  return {
                    ...prev,
                    matches: prev.matches.filter(
                      (match) => match.id !== matchData.id
                    ),
                  };
                }
                default: {
                  console.error("Invalid updateMatch type: ", type);
                  return prev;
                }
              }
            },
          })
        }
      />
    </div>
  );
};

export default Matches;
