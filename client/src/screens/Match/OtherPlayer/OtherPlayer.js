import React from "react";
import * as R from "ramda";

import actionsToText from "../../../utils/actionsToText.json";
import { getRandomAvatar } from "../../../utils/player";
import styles from "./OtherPlayer.module.scss";

export default function OtherPlayer({
  player,
  position, // top | right | bottom | left
  playedCards,
  isTheirTurn,
  action,
}) {
  // @TODO: Add styles for 6 players
  const classesByPosition = {
    top: "top-0 mt-4 left-1/2 transform -translate-x-1/2",
    right: "right-0 mr-4 top-1/2 transform -translate-y-1/2",
    left: "left-0 ml-4 top-1/2 transform -translate-y-1/2",
  }[position];

  return (
    <div className={`flex flex-col items-center absolute ${classesByPosition}`}>
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
      {action && action.type && (
        <div
          style={{ top: "calc(100% + 18px)" }}
          className={`${styles.actionDialog} absolute bg-white rounded-md px-4 py-2 uppercase font-bold text-gray-800 whitespace-no-wrap`}
        >
          {["POINTS", "N_ARE_MORE"]
            ? actionsToText[action.type].replace("{{points}}", action.points)
            : actionsToText[action.type]}
        </div>
      )}
    </div>
  );
}
