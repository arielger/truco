import React from "react";
import { gql } from "@apollo/client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrownOpen } from "@fortawesome/free-solid-svg-icons";
import { Link, RouteComponentProps } from "react-router-dom";

import WaitingState from "./WaitingState";
import GameBoard from "./GameBoard";

import Button from "../../components/Button";
import Spinner from "../../components/Spinner";

import {
  useFetchMatchQuery,
  User,
  MatchUpdatedSubscription,
  MatchUpdatedSubscriptionVariables,
} from "../../types/graphql";

// @TODO: Find a way to prevent repeating all fields in MATCH_QUERY and MATCH_SUBSCRIPTION

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MATCH_QUERY = gql`
  query fetchMatch($id: ID!) {
    match(id: $id) {
      id
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
        isFromFirstTeam
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
    }
  }
`;

const MATCH_SUBSCRIPTION = gql`
  subscription matchUpdated($matchId: ID!) {
    matchUpdated(matchId: $matchId) {
      id
      type
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
        isFromFirstTeam
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
    }
  }
`;

// https://www.pluralsight.com/guides/react-router-typescript
type TParams = {
  matchId: string;
};

interface Props extends RouteComponentProps<TParams> {
  user: User;
}

function Match({ user, match: urlMatch }: Props) {
  const matchId = urlMatch.params.matchId;

  const [showCreatorLeft, setShowCreatorLeft] = React.useState(false);

  const {
    loading,
    error,
    data,
    subscribeToMore: subscribeToMatchUpdates,
  } = useFetchMatchQuery({
    variables: { id: matchId },
    fetchPolicy: "network-only",
  });

  React.useEffect(() => {
    console.log("Subscribe to match updates");

    const unsubscribe = subscribeToMatchUpdates<
      MatchUpdatedSubscription,
      MatchUpdatedSubscriptionVariables
    >({
      document: MATCH_SUBSCRIPTION,
      variables: { matchId },
      // @TODO: Check if we need to update the whole match object for each update
      updateQuery: (prev, { subscriptionData }) => {
        const {
          type: updateType,
          ...matchUpdated
        } = subscriptionData?.data?.matchUpdated;

        if (updateType === "CREATOR_LEFT_GAME") {
          setShowCreatorLeft(true);
        }

        return { ...prev, match: { ...prev.match, ...matchUpdated } };
      },
    });
    return () => {
      unsubscribe();
    };
  }, [matchId, subscribeToMatchUpdates]);

  const match = data?.match;

  // @TODO: Improve loading and error screens
  if (loading || !match) {
    return <Spinner fullHeight text="Cargando partida" />;
  }
  if (error)
    return (
      <div className="h-full flex flex-col justify-center items-center p-4">
        <div className="flex flex-col justify-center items-center text-center flex-1">
          <FontAwesomeIcon icon={faFrownOpen} className="text-4xl mb-4" />
          <span className="mb-2">Hubo un error al cargar la partida</span>
          <span className="text-sm text-gray-500">
            Estás seguro que ingresaste el código correcto?
          </span>
        </div>
        <Link to="/partidas" className="w-full">
          <Button styleType="primary">Volver al listado de partidas</Button>
        </Link>
      </div>
    );

  const joinedMatch =
    Boolean(user?.id) &&
    match?.players.map((player) => player.id).includes(user.id);

  return (
    <>
      {match.status === "waiting" ? (
        <WaitingState
          userId={user?.id}
          matchId={matchId}
          players={match.players}
          points={match.points}
          playersCount={match.playersCount}
          creator={match.creator}
          isCreator={user?.id === match.creator.id}
          joinedMatch={joinedMatch}
          showCreatorLeft={showCreatorLeft}
        />
      ) : match.status === "playing" ? (
        <GameBoard match={match} user={user} matchId={matchId} />
      ) : match.status === "finished" ? (
        <span>La partida ya ha finalizado.</span>
      ) : null}
    </>
  );
}

export default Match;
