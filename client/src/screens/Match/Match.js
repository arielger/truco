import React, { Fragment } from "react";
import * as R from "ramda";
import { Query, Mutation, withApollo } from "react-apollo";
import { Prompt } from "react-router-dom";
import gql from "graphql-tag";

import styles from "./Match.module.scss";

import PlayerCards from "./PlayerCards";
import PlayedCards from "./PlayedCards";
import Scores from "./Scores";
import Actions from "./Actions";
import WinnerModal from "./WinnerModal";

const JOIN_MATCH = gql`
  mutation joinMatch($matchId: ID!) {
    joinMatch(matchId: $matchId) {
      id
    }
  }
`;

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
      myCards {
        id
        card
        played
      }
      cardsPlayedByPlayer {
        playerId
        cards
      }
    }
  }
`;

const MatchInner = ({
  user,
  matchId,
  joinMatch,
  subscribeToUpdates,
  history,
  client,
  data,
  loading,
  error
}) => {
  React.useEffect(() => {
    const unsubscribe = subscribeToUpdates();
    return () => {
      unsubscribe();
    };
  });

  if (loading) return <span>Loading</span>;
  if (error) return <span>Error</span>;

  const userJoinedMatch = R.pipe(
    R.map(R.prop("id")),
    R.includes(user.id)
  )(data.match.players);

  const notPlayedCards = R.reject(R.prop("played"), data.match.myCards);
  const playedCards = R.pipe(
    R.find(R.propEq("playerId", user.id)),
    R.prop("cards"),
    R.defaultTo([])
  )(data.match.cardsPlayedByPlayer);

  const currentHand = playedCards.length + 1;

  const isCurrentPlayer = data.match.nextPlayer === user.id;

  const otherPlayers = R.reject(R.propEq("id", user.id), data.match.players);

  return (
    <div className={styles["match-inner"]}>
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
          {!userJoinedMatch && (
            <button onClick={joinMatch}>Unirse a la partida</button>
          )}
        </div>
      )}
      {data.match.status === "playing" && (
        <Fragment>
          <Scores
            moreThanTwoPlayers={data.match.players.length > 2}
            matchPoints={data.match.points}
            myPoints={data.match.myPoints}
            theirPoints={data.match.theirPoints}
          />
          <Actions
            client={client}
            match={data.match}
            matchId={matchId}
            isCurrentPlayer={isCurrentPlayer}
            currentHand={currentHand}
          />
          <PlayedCards
            cardsPlayedByPlayer={data.match.cardsPlayedByPlayer}
            userId={user.id}
          />
          {otherPlayers.map(player => (
            <PlayerCards
              key={player.id}
              player={player}
              isTheirTurn={player.id === data.match.nextPlayer}
              position="top" //@todo: Refactor to handle 4 and 6 players
              playedCards={R.pipe(
                R.find(R.propEq("playerId", player.id)),
                R.propOr([], "cards")
              )(data.match.cardsPlayedByPlayer)}
            />
          ))}
          <Mutation mutation={PLAY_CARD}>
            {playCard => (
              <PlayerCards
                player={user}
                isTheirTurn={isCurrentPlayer}
                position="bottom"
                isCurrentUser={true}
                enablePlayCards={
                  !data.match.roundWinnerTeam &&
                  data.match.nextPlayer === user.id
                }
                playedCards={playedCards}
                notPlayedCards={notPlayedCards}
                handlePlayCard={cardId =>
                  playCard({ variables: { matchId, cardId } })
                }
              />
            )}
          </Mutation>
          {data.match.matchWinnerTeam && (
            <WinnerModal
              history={history}
              winnerTeam={data.match.matchWinnerTeam}
            />
          )}
        </Fragment>
      )}
    </div>
  );
};

function Match({ history, user, match, client }) {
  const matchId = match.params.matchId;

  const joinMatch = () => {
    client
      .mutate({
        variables: { matchId },
        mutation: JOIN_MATCH
      })
      .then(({ data: { joinMatch } }) => {
        console.log("joinMatch:", joinMatch);
      });
  };

  return (
    <div className={styles["match"]}>
      <Prompt message="Estas seguro que quieres abandonar la partida?" />
      <Query
        query={MATCH_QUERY}
        variables={{ id: matchId }}
        fetchPolicy="cache-and-network"
      >
        {({ subscribeToMore, ...result }) => (
          <MatchInner
            {...result}
            user={user}
            matchId={matchId}
            history={history}
            joinMatch={joinMatch}
            client={client}
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

export default withApollo(Match);
