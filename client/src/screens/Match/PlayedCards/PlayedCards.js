import React from "react";
import * as R from "ramda";

import Card from "../../../components/Card";
import cards from "../../../utils/cards";

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
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-8 pb-20">
      {cardsByPlayer.map(({ playerId, cards, isCurrentPlayer }) => (
        <div key={playerId} className="flex items-center space-x-3">
          {cards.map((card, index) => (
            <Card
              width={80}
              key={card}
              card={card}
              style={{
                zIndex: getCardZIndex({ card, cardsByPlayer, index }),
              }}
            />
          ))}
          {Array(3 - cards.length)
            .fill(undefined)
            .map((_, i) => (
              <Card width={80} key={i} isPlaceholder />
            ))}
        </div>
      ))}
    </div>
  );
}
