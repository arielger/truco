import React from "react";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";
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
  mutation playEnvido($matchId: ID!, $action: EnvidoActions!) {
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

const LEAVE_ROUND = gql`
  mutation leaveRound($matchId: ID!) {
    leaveRound(matchId: $matchId) {
      success
      message
    }
  }
`;

const ActionButton = ({ className = "", ...props }) => (
  <button
    {...props}
    className={`${styles.actionButton} w-32 h-8 text-sm inline-flex items-center justify-center text-gray-100 border border-black rounded hover:bg-black focus:bg-black transition-colors duration-200 ${className}`}
  ></button>
);

export default function ActionsList({
  matchId,
  ourAction,
  theirAction,
  sayEnvidoActions = [],
  envidoPoints,
  envidoActions = [],
  trucoActions = [],
}) {
  const [playTruco] = useMutation(PLAY_TRUCO);
  const [playEnvido] = useMutation(PLAY_ENVIDO);
  const [sayEnvido] = useMutation(SAY_ENVIDO);
  const [leaveRound] = useMutation(LEAVE_ROUND);

  return (
    <div className="flex flex-col items-center absolute left-0 bottom-0 m-2">
      {theirAction && (
        <div className="flex flex-col items-center mb-4">
          <span className="text-sm">Cantaron </span>
          <span className="uppercase text-xl font-semibold">
            {actionsToText[theirAction]}
          </span>
        </div>
      )}
      {ourAction && (
        <div className="flex flex-col items-center">
          <span className="text-sm">Cantaste </span>
          <span className="uppercase text-xl font-semibold mb-6">
            {actionsToText[ourAction]}
          </span>
          <div className="flex flex-col items-center p-2">
            <Spinner color="rgba(255,255,255, 0.5)" />
            <span className="text-xs mt-2 text-gray-200">
              Esperando respuesta
            </span>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center space-y-2">
        {sayEnvidoActions &&
          sayEnvidoActions.length > 0 &&
          sayEnvidoActions.map((action) => (
            <ActionButton
              key={action}
              onClick={() => sayEnvido({ variables: { matchId, action } })}
            >
              {actionsToText[action].replace("{{points}}", envidoPoints)}
            </ActionButton>
          ))}
        {envidoActions &&
          envidoActions.length > 0 &&
          envidoActions.map((action) => (
            <ActionButton
              key={action}
              onClick={() => playEnvido({ variables: { matchId, action } })}
            >
              {actionsToText[action]}
            </ActionButton>
          ))}
        {trucoActions &&
          trucoActions.length > 0 &&
          trucoActions.map((action) => (
            <ActionButton
              key={action}
              onClick={() => playTruco({ variables: { matchId, action } })}
            >
              {actionsToText[action]}
            </ActionButton>
          ))}
        {!ourAction && (
          <ActionButton
            key="leaveRound"
            onClick={() => leaveRound({ variables: { matchId } })}
          >
            {actionsToText.LEAVE_ROUND}
          </ActionButton>
        )}
      </div>
    </div>
  );
}
