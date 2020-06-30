import React from "react";
import Card from "../../../components/Card";
import cards from "../../../utils/cards";

import { CardsByPlayer } from "../../../types/graphql";

// Get card z-index based on card score
// (the winner card should be in front of the others so its easier to identify the winner)
const getCardScore = (card: string): number => {
  return cards.find(({ card: cardName }) => cardName === card)?.score || 0;
};

type Props = {
  cardsPlayedByPlayer: CardsByPlayer[];
  userId: string;
};

export default function PlayedCards({ cardsPlayedByPlayer, userId }: Props) {
  const cardsByPlayer = cardsPlayedByPlayer
    // Create new array to prevent mutating param
    .slice()
    // Put current player last in the list (so the cards are in the bottom section of the screen)
    .sort((playerA, playerB) =>
      playerA.playerId === userId ? 1 : playerB.playerId === userId ? -1 : 0
    );

  return (
    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 space-y-8 pb-20">
      {cardsByPlayer.map(({ playerId, cards }) => (
        <div key={playerId} className="flex items-center space-x-3">
          {cards.map((card, index) => (
            <Card
              width={80}
              key={card}
              card={card}
              style={{
                zIndex: getCardScore(card),
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
