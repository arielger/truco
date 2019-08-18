import React from "react";
import gql from "graphql-tag";
import Spinner from "react-svg-spinner";

import actionsToText from "../../../utils/actionsToText.json";
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

const SAY_ENVIDO = gql`
  mutation sayEnvido($matchId: ID!, $action: SayEnvidoActions!) {
    sayEnvido(matchId: $matchId, action: $action) {
      success
      message
    }
  }
`;

const getMutation = {
  truco: PLAY_TRUCO,
  envido: PLAY_ENVIDO,
  sayEnvido: SAY_ENVIDO
};

export default function ActionsList({
  matchId,
  client,
  ourAction,
  theirAction,
  sayEnvidoActions = [],
  envidoPoints,
  envidoActions = [],
  trucoActions = []
}) {
  const playAction = (type, action) => {
    client.mutate({
      mutation: getMutation[type],
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
      {sayEnvidoActions && sayEnvidoActions.length > 0 && (
        <div className={styles.actionsType}>
          {sayEnvidoActions.map(action => (
            <button
              key={action}
              className={styles.action}
              onClick={() => playAction("sayEnvido", action)}
            >
              {actionsToText[action].replace("{{points}}", envidoPoints)}
            </button>
          ))}
        </div>
      )}
      {envidoActions && envidoActions.length > 0 && (
        <div className={styles.actionsType}>
          {envidoActions.map(action => (
            <button
              key={action}
              className={styles.action}
              onClick={() => playAction("envido", action)}
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
              onClick={() => playAction("truco", action)}
            >
              {actionsToText[action]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
