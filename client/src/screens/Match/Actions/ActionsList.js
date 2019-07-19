import React from "react";
import gql from "graphql-tag";
import Spinner from "react-svg-spinner";

import styles from "./Actions.module.scss";

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

const actionsToText = {
  ACCEPT: "Quiero",
  REJECT: "No quiero",
  TRUCO: "Truco",
  RETRUCO: "Retruco",
  VALE_CUATRO: "Vale cuatro",
  ENVIDO: "Envido",
  REAL_ENVIDO: "Real envido",
  FALTA_ENVIDO: "Falta envido"
};

export default function ActionsList({
  matchId,
  client,
  ourAction,
  theirAction,
  envidoActions = [],
  trucoActions = []
}) {
  const playAction = (action, type) => {
    client.mutate({
      mutation: type === "truco" ? PLAY_TRUCO : PLAY_ENVIDO,
      variables: { matchId, action }
    });
  };

  return (
    <div className={styles.actions}>
      {theirAction && (
        <div className={styles.playerAction}>
          Cantaron <span>{actionsToText[theirAction]}</span>
        </div>
      )}
      {ourAction && (
        <>
          <div className={styles.playerAction}>
            Cantaste <span>{actionsToText[ourAction]}</span>
          </div>
          <div className={styles.waitForResponse}>
            <Spinner color="rgba(255,255,255, 0.5)" />
            <span>Esperando respuesta</span>
          </div>
        </>
      )}
      {envidoActions && envidoActions.length > 0 && (
        <div className={styles.actionsType}>
          {envidoActions.map(action => (
            <button
              key={action}
              className={styles.action}
              onClick={() => playAction(action, "envido")}
            >
              {actionsToText[action]}
            </button>
          ))}
        </div>
      )}
      {envidoActions.length >= 1 && trucoActions.length >= 1 && (
        <span className={styles.divider} />
      )}
      {trucoActions && trucoActions.length > 0 && (
        <div className={styles.actionsType}>
          {trucoActions.map(action => (
            <button
              key={action}
              className={styles.action}
              onClick={() => playAction(action, "truco")}
            >
              {actionsToText[action]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
