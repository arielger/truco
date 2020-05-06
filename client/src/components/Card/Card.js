import React from "react";
import cs from "classnames";

import styles from "./Card.module.scss";

const cardOriginalSize = {
  width: 117,
  height: 180,
  background: 1404,
};

const stepCardYOffset = {
  GOLD: 0,
  CUP: 1,
  SWORD: 2,
  BASTO: 3,
};

export default function Card({
  isPlaceholder,
  isHidden,
  isDisabled,
  card,
  width = 117,
  onClick = () => {},
  style,
}) {
  const sizeFactor = width / cardOriginalSize.width;
  const cardSize = {
    width: cardOriginalSize.width * sizeFactor,
    height: cardOriginalSize.height * sizeFactor,
  };

  if (isHidden || isPlaceholder) {
    return (
      <div
        className={styles.card}
        style={{
          ...cardSize,
          backgroundSize: `${cardOriginalSize.background * sizeFactor}px`,
          ...(isHidden
            ? {
                backgroundPosition: `${-1 * cardSize.width}px ${
                  -4 * cardSize.height
                }px`,
              }
            : {}),
          ...(isPlaceholder
            ? {
                background: "#313336",
                width: cardSize.width - 2,
              }
            : {}),
          ...style,
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
        [styles.disabled]: isDisabled,
      })}
      style={{
        ...cardSize,
        cursor: onClick ? "pointer" : "initial",
        backgroundSize: `${cardOriginalSize.background * sizeFactor}px`,
        backgroundPosition: isHidden
          ? `${-1 * cardSize.width}px ${-4 * cardSize.height}px`
          : `${(cardNumber - 1) * -cardSize.width}px ${
              -stepCardYOffset[cardStep] * cardSize.height
            }px`,
        ...style,
      }}
    />
  );
}
