import React from "react";
import { useMutation, gql } from "@apollo/client";

import Card from "../../../components/Card";
import ActionDialog from "../../../components/ActionDialog";

import { Card as CardType, Action } from "../../../types/graphql";

const PLAY_CARD = gql`
  mutation playCard($matchId: ID!, $cardId: ID!) {
    playCard(matchId: $matchId, cardId: $cardId) {
      myCards {
        id
        card
        played
      }
      cardsPlayedByPlayer {
        playerId
        cards
      }
    }
  }
`;

type Props = {
  matchId: string;
  enablePlayCards: boolean;
  notPlayedCards: CardType[];
  action?: Action | null;
};

export default function YourCards({
  matchId,
  enablePlayCards,
  notPlayedCards,
  action,
}: Props) {
  const [playCard] = useMutation(PLAY_CARD);

  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-8">
      {action && action.type && (
        <ActionDialog action={action} position="bottom" />
      )}
      <div
        className={`flex space-x-1 ${
          enablePlayCards ? "opacity-100" : " opacity-50"
        }`}
      >
        {notPlayedCards.map(({ id, card }) => (
          <Card
            width={90}
            key={card}
            card={card}
            onClick={() =>
              enablePlayCards &&
              playCard({ variables: { cardId: id, matchId } })
            }
          />
        ))}
      </div>
    </div>
  );
}
