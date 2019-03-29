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
      className={cs(styles.cards, {
        [styles[position]]: true,
        [styles.disabled]: !enablePlayCards
      })}
    >
      {isCurrentUser
        ? notPlayedCards.map(({ id, card }) => (
            <Card
              key={card}
              card={card}
              onClick={() => enablePlayCards && handlePlayCard(id)}
            />
          ))
        : R.times(
            i => <Card key={i} isHidden={true} />,
            3 - playedCards.length
          )}
    </div>
  );
}
