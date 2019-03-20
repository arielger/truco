import React from "react";
import * as R from "ramda";
import cs from "classnames";

import Card from "../../../components/Card";
import styles from "./PlayerCards.module.scss";

export default function PlayerCards({
  position, // top, right, bottom, left
  playedCards,
  enablePlayCards,
  isCurrentUser,
  notPlayedCards,
  handlePlayCard
}) {
  return (
    <div
      className={cs(styles.playerCards, {
        [styles[position]]: true
      })}
    >
      <div className={styles.playedCards}>
        {playedCards.map(card => (
          <Card key={card} card={card} />
        ))}
        {Array(3 - playedCards.length)
          .fill(undefined)
          .map((_, i) => (
            <Card key={i} isPlaceholder={true} />
          ))}
      </div>
      <div className={styles.notPlayedCards}>
        {isCurrentUser
          ? notPlayedCards.map(({ id, card }) => (
              <Card
                key={card}
                isDisabled={!enablePlayCards}
                card={card}
                onClick={() => enablePlayCards && handlePlayCard(id)}
              />
            ))
          : R.times(
              i => <Card key={i} isHidden={true} />,
              3 - playedCards.length
            )}
      </div>
    </div>
  );
}
