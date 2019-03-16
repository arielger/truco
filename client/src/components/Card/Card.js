import React from "react";

import styles from "./Card.module.scss";

const stepCardYOffset = {
  GOLD: "0",
  CUP: "-319px",
  SWORD: "-638px",
  BASTO: "-958px"
};

export default function Card({ card, onClick }) {
  const [cardNumber, cardStep] = card.split("-");
  return (
    <div
      onClick={() => onClick(card)}
      className={styles["card"]}
      style={{
        backgroundPosition: `${(cardNumber - 1) * -208}px ${
          stepCardYOffset[cardStep]
        }`
      }}
    />
  );
}
