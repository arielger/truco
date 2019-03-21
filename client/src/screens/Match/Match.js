import React, { Fragment } from "react";
import * as R from "ramda";
import { Query, Mutation } from "react-apollo";
import { Prompt } from "react-router-dom";
import gql from "graphql-tag";
import Modal from "react-modal";

import styles from "./Match.module.scss";
import PlayerCards from "./PlayerCards";
import Scores from "./Scores";

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
  myPoints
  theirPoints
  roundWinnerTeam
  matchWinnerTeam
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
  subscribeToUpdates,
  history,
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

  const notPlayedCards = R.reject(R.prop("played"), data.match.myCards);
  const playedCards = R.pipe(
    R.find(R.propEq("playerId", user.id)),
    R.prop("cards")
  )(data.match.cardsPlayedByPlayer);

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
        </div>
      )}
      {data.match.status === "playing" && (
        <Fragment>
          <Scores
            matchPoints={data.match.points}
            myPoints={data.match.myPoints}
            theirPoints={data.match.theirPoints}
          />
          {otherPlayers.map(player => (
            <PlayerCards
              position="top" //@todo: Refactor to handle 4 and 6 players
              playedCards={R.pipe(
                R.find(R.propEq("playerId", player.id)),
                R.prop("cards")
              )(data.match.cardsPlayedByPlayer)}
            />
          ))}
          <Mutation mutation={PLAY_CARD}>
            {playCard => (
              <PlayerCards
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
          <Modal
            isOpen={data.match.matchWinnerTeam}
            onRequestClose={() => {
              history.replace("/matches");
            }}
          >
            <h2>
              {data.match.matchWinnerTeam === "we"
                ? "Has ganado"
                : "Has perdido"}
            </h2>
          </Modal>
        </Fragment>
      )}
    </div>
  );
};

export default function Match({ history, user, match }) {
  const matchId = match.params.matchId;

  React.useEffect(() => {
    // @todo: Join match when entering Match screen (so it's possible to share URL)
  }, []);

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
                ) => ({ ...prev, match: matchUpdated })
              })
            }
          />
        )}
      </Query>
    </div>
  );
}
