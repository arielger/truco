import React from "react";
import * as R from "ramda";
import cs from "classnames";

import Card from "../../../components/Card";
import cards from "../../../utils/cards";

import styles from "./PlayedCards.module.scss";

const getCardZIndex = ({ card, cardsByPlayer, index }) => {
  return R.pipe(
    R.map(R.path(["cards", index])),
    () => R.find(R.propEq("card", card))(cards),
    R.prop("score")
  )(cardsByPlayer);
};

export default function PlayedCards({ cardsPlayedByPlayer, userId }) {
  // Put current player last in the list
  const cardsByPlayer = R.pipe(
    R.map(
      R.when(R.propEq("playerId", userId), R.assoc("isCurrentPlayer", true))
    ),
    R.sortWith([R.ascend(R.propOr(false, "isCurrentPlayer"))])
  )(cardsPlayedByPlayer);

  return (
    <div className={styles.playedCards}>
      {cardsByPlayer.map(({ playerId, cards, isCurrentPlayer }) => (
        <div
          key={playerId}
          className={cs(styles.playerCards, {
            [styles.isCurrentPlayer]: isCurrentPlayer
          })}
        >
          {cards.map((card, index) => (
            <Card
              key={card}
              card={card}
              style={{
                zIndex: getCardZIndex({ card, cardsByPlayer, index }),
                margin: 0
              }}
            />
          ))}
          {Array(3 - cards.length)
            .fill(undefined)
            .map((_, i) => (
              <Card key={i} isPlaceholder style={{ margin: 0 }} />
            ))}
        </div>
      ))}
    </div>
  );
}
