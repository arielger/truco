import React from "react";
import * as R from "ramda";

import ActionDialog from "../../../components/ActionDialog";

import { getRandomAvatar } from "../../../utils/player";

import { Player, Action } from "../../../types/graphql";

export enum Position {
  Top = "TOP",
  Left = "LEFT",
  Right = "RIGHT",
}

// @TODO: Add styles for 6 players
const classesByPosition: Dictionary<string> = {
  [Position.Top]: "top-0 mt-4 left-1/2 transform -translate-x-1/2",
  [Position.Right]: "right-0 mr-4 top-1/2 transform -translate-y-1/2",
  [Position.Left]: "left-0 ml-4 top-1/2 transform -translate-y-1/2",
};

type Props = {
  player: Player;
  position: Position;
  playedCards: string[];
  isTheirTurn?: boolean;
  action?: Action | null;
};

export default function OtherPlayer({
  player,
  position,
  playedCards = [],
  isTheirTurn,
  action,
}: Props) {
  const classes = classesByPosition[position];

  return (
    <div className={`flex flex-col items-center absolute ${classes}`}>
      <div className="relative">
        <img
          style={{ border: `3px solid ${isTheirTurn ? "#e53e3e" : "#4F4F4F"}` }}
          className={`w-12 h-12 rounded-full border-3 mb-1`}
          src={player.avatar || getRandomAvatar(player.name, 48)}
          alt=""
        />
        <div style={{ left: "100%" }} className="absolute top-0 flex -ml-1">
          {R.times(
            (i) => (
              <span
                style={{
                  width: "18px",
                  height: "28px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.5)",
                }}
                className="inline-block rounded-sm bg-white -ml-2"
                key={i}
              />
            ),
            3 - playedCards.length
          )}
        </div>
      </div>
      <span className="text-xs font-medium tracking-wider">{player.name}</span>
      {action?.type && <ActionDialog action={action} position="top" />}
    </div>
  );
}
