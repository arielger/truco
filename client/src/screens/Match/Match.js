import React, { Fragment } from "react";
import * as R from "ramda";
import { Query, Mutation } from "react-apollo";
import { Prompt } from "react-router-dom";
import gql from "graphql-tag";
import Modal from "react-modal";

import styles from "./Match.module.scss";
import PlayerCards from "./PlayerCards";
import Scores from "./Scores";

const trucoActions = ["TRUCO", "RETRUCO", "VALE_CUATRO"];

const nextPossibleAction = action =>
  R.pipe(
    act => R.findIndex(R.equals(act), trucoActions),
    R.inc,
    actionIndex => trucoActions[actionIndex]
  )(action);

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
  truco {
    type
    status
    team
    hand
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

const PLAY_TRUCO = gql`
  mutation playTruco($matchId: ID!, $action: TrucoActions!) {
    playTruco(matchId: $matchId, action: $action) {
      success
      message
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

  const currentHand = playedCards.length + 1;

  const otherPlayers = R.reject(R.propEq("id", user.id), data.match.players);

  const trucoAvailableActions = R.cond([
    [
      R.pipe(
        // Don't show any action if...
        R.anyPass([
          // it's not your turn and you are not answering
          R.both(
            R.always(data.match.nextPlayer !== user.id),
            ({ status }) => status !== "PENDING"
          ),
          // are waiting for response of the other team
          R.both(R.propEq("status", "PENDING"), R.propEq("team", "we")),
          // the other team accepted truco the last time
          R.both(R.propEq("status", "ACCEPTED"), R.propEq("team", "them")),
          // you accepted truco in the same hand (prevent saying truco + action in sequence)
          R.allPass([
            R.propEq("status", "ACCEPTED"),
            R.propEq("team", "we"),
            R.propEq("hand", currentHand)
          ])
        ])
      ),
      R.always([])
    ],
    // If is answering show accept, reject and next type
    [
      R.propEq("status", "PENDING"),
      R.pipe(
        R.prop("type"),
        type => (type ? [nextPossibleAction(type)] : []),
        R.filter(Boolean),
        R.concat(["ACCEPT", "REJECT"])
      )
    ],
    // Otherwise, show only next type
    [
      R.T,
      R.pipe(
        R.prop("type"),
        nextPossibleAction,
        R.of,
        R.filter(Boolean)
      )
    ]
  ])({
    type: R.path(["truco", "type"])(data.match),
    status: R.path(["truco", "status"])(data.match),
    team: R.path(["truco", "team"])(data.match),
    hand: R.path(["truco", "hand"])(data.match)
  });

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
          <Mutation mutation={PLAY_TRUCO}>
            {playTruco => (
              <div
                style={{ display: "flex", flexDirection: "column", width: 200 }}
              >
                {trucoAvailableActions.map(action => (
                  <button
                    disabled={!data.match.nextPlayer === user.id}
                    onClick={() =>
                      playTruco({
                        variables: { matchId, action }
                      })
                    }
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}
          </Mutation>
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
            isOpen={!!data.match.matchWinnerTeam}
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
