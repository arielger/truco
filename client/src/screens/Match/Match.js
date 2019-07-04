import React, { Fragment } from "react";
import * as R from "ramda";
import { Query, Mutation, withApollo } from "react-apollo";
import { Prompt } from "react-router-dom";
import gql from "graphql-tag";
import Modal from "react-modal";

import styles from "./Match.module.scss";

import PlayerCards from "./PlayerCards";
import PlayedCards from "./PlayedCards";
import Scores from "./Scores";
import { getTrucoActions, getEnvidoActions } from "./utils";

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

const PLAY_TRUCO = gql`
  mutation playTruco($matchId: ID!, $action: TrucoActions!) {
    playTruco(matchId: $matchId, action: $action) {
      success
      message
    }
  }
`;

const PLAY_ENVIDO = gql`
  mutation playTruco($matchId: ID!, $action: EnvidoActions!) {
    playEnvido(matchId: $matchId, action: $action) {
      success
      message
    }
  }
`;

const MatchInner = ({
  user,
  matchId,
  joinMatch,
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

  const otherPlayers = R.reject(R.propEq("id", user.id), data.match.players);

  const trucoAvailableActions =
    data.match.status === "playing" &&
    R.cond([
      [
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
        ]),
        R.always([])
      ],
      // If is answering show accept, reject and next type
      [
        R.propEq("status", "PENDING"),
        R.pipe(
          R.prop("type"),
          type => (type ? [getTrucoActions(type)] : []),
          R.filter(Boolean),
          R.concat(["ACCEPT", "REJECT"])
        )
      ],
      // Otherwise, show only next type
      [
        R.T,
        R.pipe(
          R.prop("type"),
          getTrucoActions,
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

  const envidoAvailableActions =
    data.match.status === "playing" &&
    R.cond([
      [
        () =>
          !data.match.envido &&
          data.match.nextPlayer === user.id &&
          data.match.isLastPlayerFromTeam &&
          R.pipe(
            R.filter(R.propEq("played", true)),
            R.length,
            playedCards => playedCards === 0
          )(data.match.myCards),
        R.always(["ENVIDO", "REAL_ENVIDO", "FALTA_ENVIDO"])
      ],
      [
        R.both(R.propEq("status", "PENDING"), R.propEq("team", "them")),
        ({ list = [] }) => ["ACCEPT", "REJECT", ...getEnvidoActions(list)]
      ],
      [R.T, R.always([])]
    ])(R.propOr({}, "envido", data.match));

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
          <Mutation mutation={PLAY_TRUCO}>
            {playTruco => (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: 200
                }}
              >
                {trucoAvailableActions.map(action => (
                  <button
                    key={action}
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
          <Mutation mutation={PLAY_ENVIDO}>
            {playEnvido => (
              <div>
                {envidoAvailableActions.map(action => (
                  <button
                    key={action}
                    onClick={() =>
                      playEnvido({
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
          <PlayedCards
            cardsPlayedByPlayer={data.match.cardsPlayedByPlayer}
            userId={user.id}
          />
          {otherPlayers.map(player => (
            <PlayerCards
              key={player.id}
              position="top" //@todo: Refactor to handle 4 and 6 players
              playedCards={R.pipe(
                R.find(R.propEq("playerId", player.id)),
                R.propOr("cards")
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
