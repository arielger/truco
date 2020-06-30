import * as R from "ramda";

const getCardNumber = (card: string) => Number(card.split("-")[0]);
const getCardStep = (card: string): string => card.split("-")[1];

const getCardEnvidoValue = (card: string): number => {
  const cardNumber = getCardNumber(card);
  return cardNumber > 7 ? 0 : cardNumber;
};

const getPointsBySet = (cards: string[]): number => {
  const twoCardsBonus = cards.length >= 2 ? 20 : 0;
  const orderedCards = cards
    // Sort cards based on descending envido value order
    .sort(
      (cardA, cardB) => getCardEnvidoValue(cardB) - getCardEnvidoValue(cardA)
    )
    // Take only the first two cards with best envido value
    .slice(0, 2);

  return orderedCards.reduce((total, card) => {
    const cardNumber = getCardNumber(card);
    return total + (cardNumber > 7 ? 0 : cardNumber);
  }, twoCardsBonus);
};

// How to calculate envido guide
// https://es.wikipedia.org/wiki/Truco_argentino#Envido
export const getEnvidoFromPlayer = (cards: string[]): number => {
  return R.pipe(
    R.groupBy(getCardStep),
    R.values,
    R.map(getPointsBySet),
    (points: number[]) => Math.max(...points)
  )(cards);
};
