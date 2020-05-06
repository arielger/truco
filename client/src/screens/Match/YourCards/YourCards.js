import React from "react";
import { useMutation } from "react-apollo";
import gql from "graphql-tag";

import Card from "../../../components/Card";

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

export default function YourCards({
  matchId,
  enablePlayCards,
  notPlayedCards,
}) {
  const [playCard] = useMutation(PLAY_CARD);

  return (
    <div
      className={`flex absolute left-1/2 transform -translate-x-1/2 space-x-1 bottom-0 ${
        enablePlayCards ? "opacity-100" : " opacity-50"
      }`}
    >
      {notPlayedCards.map(({ id, card }) => (
        <Card
          width={90}
          key={card}
          card={card}
          onClick={() =>
            enablePlayCards && playCard({ variables: { cardId: id, matchId } })
          }
        />
      ))}
    </div>
  );
}
