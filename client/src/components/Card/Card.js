import React from "react";
import cs from "classnames";

import styles from "./Card.module.scss";

const cardSize = {
  width: 117,
  height: 180
};

const stepCardYOffset = {
  GOLD: 0,
  CUP: 1,
  SWORD: 2,
  BASTO: 3
};

export default function Card({
  isPlaceholder,
  isHidden,
  isDisabled,
  card,
  onClick = () => {},
  style
}) {
  if (isHidden || isPlaceholder) {
    return (
      <div
        className={styles.card}
        style={{
          ...cardSize,
          ...(isHidden
            ? {
                backgroundPosition: `${-1 * cardSize.width}px ${-4 *
                  cardSize.height}px`
              }
            : {}),
          ...(isPlaceholder
            ? {
                border: "1px dashed rgba(255,255,255,0.2)",
                background: "none",
                width: cardSize.width - 2
              }
            : {}),
          ...style
        }}
      />
    );
  }

  const [cardNumber, cardStep] = card.split("-");

  return (
    <div
      onClick={() => onClick(card)}
      className={cs({
        [styles.card]: true,
        [styles.disabled]: isDisabled
      })}
      style={{
        ...cardSize,
        cursor: onClick ? "pointer" : "initial",
        backgroundPosition: isHidden
          ? `${-1 * cardSize.width}px ${-4 * cardSize.height}px`
          : `${(cardNumber - 1) * -cardSize.width}px ${-stepCardYOffset[
              cardStep
            ] * cardSize.height}px`,
        ...style
      }}
    />
  );
}
