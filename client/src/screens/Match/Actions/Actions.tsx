import React from "react";
import * as R from "ramda";
import { useMutation, gql } from "@apollo/client";

import ActionsList from "./ActionsList";
import {
  getEnvidoActions,
  getTrucoActions,
  getSayEnvidoActions,
} from "./utils";
import actionsToText from "../../../utils/actionsToText";

import { PlayerMatch, PlayerEnvidoPoints } from "../../../types/graphql";

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

type Props = {
  match: PlayerMatch;
  matchId: string;
  waitingResponse: boolean;
  isCurrentPlayer: boolean;
  currentHand: number;
  nextPlayerEnvido?: string | null;
  isCurrentEnvidoPlayer: boolean;
  envidoPoints?: PlayerEnvidoPoints[] | null;
  cardPlayed: boolean;
  currentPlayerEnvidoPoints: number;
  playersCount: number;
};

export default function Actions({
  match,
  matchId,
  waitingResponse,
  isCurrentPlayer,
  currentHand,
  nextPlayerEnvido,
  isCurrentEnvidoPlayer,
  envidoPoints,
  cardPlayed,
  currentPlayerEnvidoPoints,
  playersCount,
}: Props) {
  const [showEnvidoActions, setShowEnvidoActions] = React.useState(false);

  const [playTruco] = useMutation(PLAY_TRUCO);
  const [playEnvido] = useMutation(PLAY_ENVIDO);
  const [sayEnvido] = useMutation(SAY_ENVIDO);
  const [leaveRound] = useMutation(LEAVE_ROUND);

  const actionsDisabled =
    waitingResponse ||
    (nextPlayerEnvido && !isCurrentEnvidoPlayer) ||
    !isCurrentPlayer;

  const disableEnvidoActions =
    actionsDisabled || match.envido || currentHand !== 1;

  React.useEffect(() => {
    if (disableEnvidoActions) {
      setShowEnvidoActions(false);
    }
  }, [disableEnvidoActions]);

  const leaveRoundAction = {
    type: "LEAVE_ROUND",
    text: actionsToText.LEAVE_ROUND,
    onClick: () => leaveRound({ variables: { matchId } }),
    disabled: actionsDisabled,
  };

  const { isAnsweringEnvido = false, envidoActions = [] } = getEnvidoActions(
    match,
    currentHand
  );

  const { isAnsweringTruco = false, trucoActions = [] } = getTrucoActions(
    match,
    currentHand
  );

  const actions = React.useMemo(
    () =>
      R.cond([
        [
          // If user have to tell envido points
          () => isCurrentEnvidoPlayer,
          () => {
            const sayEnvidoActions = getSayEnvidoActions({
              envidoPoints: envidoPoints || [],
              cardPlayed,
              currentPlayerEnvidoPoints,
              playersCount,
            });

            return [
              ...sayEnvidoActions.map((sayEnvidoAction) => ({
                // @TODO: Improve points interpolation handling
                type: sayEnvidoAction,
                text: actionsToText[sayEnvidoAction].replace(
                  "{{points}}",
                  String(currentPlayerEnvidoPoints)
                ),
                onClick: () =>
                  sayEnvido({
                    variables: { matchId, action: sayEnvidoAction },
                  }),
              })),
              leaveRoundAction,
            ];
          },
        ],
        [
          () => isAnsweringEnvido,
          () => [
            ...envidoActions.map((envidoAction) => ({
              type: envidoAction,
              text: actionsToText[envidoAction],
              onClick: () =>
                playEnvido({ variables: { matchId, action: envidoAction } }),
            })),
          ],
        ],
        [
          () => isAnsweringTruco,
          () => [
            ...trucoActions.map((trucoAction) => ({
              type: trucoAction,
              text: actionsToText[trucoAction],
              onClick: () =>
                playTruco({ variables: { matchId, action: trucoAction } }),
            })),
          ],
        ],
        [
          () => showEnvidoActions && !disableEnvidoActions,
          () => [
            ...envidoActions.map((envidoAction) => ({
              type: envidoAction,
              text: actionsToText[envidoAction],
              onClick: () =>
                playEnvido({ variables: { matchId, action: envidoAction } }),
            })),
            {
              type: "GO_BACK",
              text: "Volver",
              onClick: () => setShowEnvidoActions(false),
            },
          ],
        ],
        [
          R.T,
          () => [
            {
              text: "Envido",
              onClick: () => setShowEnvidoActions(true),
              disabled: disableEnvidoActions,
            },
            ...trucoActions.map((trucoAction) => ({
              text: actionsToText[trucoAction],
              onClick: () =>
                playTruco({ variables: { matchId, action: trucoAction } }),
              disabled: actionsDisabled,
            })),
            leaveRoundAction,
          ],
        ],
      ])(),
    [
      leaveRoundAction,
      cardPlayed,
      currentPlayerEnvidoPoints,
      envidoPoints,
      isCurrentEnvidoPlayer,
      matchId,
      playersCount,
      sayEnvido,
      envidoActions,
      isAnsweringEnvido,
      isAnsweringTruco,
      playEnvido,
      playTruco,
      showEnvidoActions,
      trucoActions,
      actionsDisabled,
      disableEnvidoActions,
    ]
  );

  return <ActionsList actions={actions} />;
}
