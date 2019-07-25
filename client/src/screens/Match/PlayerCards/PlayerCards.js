import React from "react";
import * as R from "ramda";
import cs from "classnames";

import actionsToText from "../../../utils/actionsToText.json";
import Card from "../../../components/Card";
import styles from "./PlayerCards.module.scss";

export default function PlayerCards({
  player,
  position, // top, right, bottom, left
  playedCards,
  enablePlayCards,
  isCurrentUser,
  isTheirTurn,
  notPlayedCards,
  handlePlayCard,
  action
}) {
  return (
    <div className={cs(styles.player, styles[position])}>
      <div className={styles.playerAvatarWrapper}>
        <img
          className={cs(styles.playerAvatar, {
            [styles.isTheirTurn]: isTheirTurn
          })}
          src={player.avatar}
          alt=""
        />
        {action && <div className={styles.action}>{actionsToText[action]}</div>}
      </div>
      {isCurrentUser ? (
        <div
          className={cs(styles.currentUserCards, {
            [styles.disabled]: !enablePlayCards
          })}
        >
          {notPlayedCards.map(({ id, card }) => (
            <Card
              key={card}
              card={card}
              onClick={() => enablePlayCards && handlePlayCard(id)}
            />
          ))}
        </div>
      ) : (
        <div className={styles.otherUserCards}>
          {R.times(
            i => (
              <span key={i} />
            ),
            3 - playedCards.length
          )}
        </div>
      )}
    </div>
  );
}
