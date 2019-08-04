import React from "react";
import * as R from "ramda";
import cs from "classnames";
import gql from "graphql-tag";

import actionsToText from "../../../utils/actionsToText.json";
import Card from "../../../components/Card";
import styles from "./PlayerCards.module.scss";

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

export default function PlayerCards({
  client,
  matchId,
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
  const playCard = cardId => {
    client.mutate({
      mutation: PLAY_CARD,
      variables: { matchId, cardId }
    });
  };

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
              onClick={() => enablePlayCards && playCard(id)}
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
