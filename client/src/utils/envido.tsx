import * as R from "ramda";

const getCardNumber = card => Number(card.split("-")[0]);
const getCardStep = card => card.split("-")[1];

const getPointsBySet = cards => {
  const twoCardsBonus = cards.length >= 2 ? 20 : 0;
  const orderedCards = R.pipe(
    R.sort(
      R.descend(card => {
        const cardNumber = getCardNumber(card);
        return cardNumber > 7 ? 0 : cardNumber;
      })
    ),
    R.take(2)
  )(cards);

  return orderedCards.reduce((total, card) => {
    const cardNumber = getCardNumber(card);
    return total + (cardNumber > 7 ? 0 : cardNumber);
  }, twoCardsBonus);
};

export const getEnvidoFromPlayer = cards => {
  return R.pipe(
    R.groupBy(getCardStep),
    R.values,
    R.map(getPointsBySet),
    points => Math.max(...points)
  )(cards);
};
