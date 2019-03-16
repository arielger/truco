const createCardsOfAllSets = ({ number, score }) =>
  ["SWORD", "BASTO", "GOLD", "CUP"].map(set => ({
    card: `${number}-${set}`,
    score
  }));

const cards = [
  { card: "1-SWORD", score: 14 },
  { card: "1-BASTO", score: 13 },
  { card: "7-SWORD", score: 12 },
  { card: "7-GOLD", score: 11 },
  ...createCardsOfAllSets({ number: 3, score: 10 }),
  ...createCardsOfAllSets({ number: 2, score: 9 }),
  { card: "1-GOLD", score: 8 },
  { card: "1-CUP", score: 8 },
  ...createCardsOfAllSets({ number: 12, score: 7 }),
  ...createCardsOfAllSets({ number: 11, score: 6 }),
  ...createCardsOfAllSets({ number: 10, score: 5 }),
  { card: "7-BASTO", score: 4 },
  { card: "7-CUP", score: 4 },
  ...createCardsOfAllSets({ number: 6, score: 3 }),
  ...createCardsOfAllSets({ number: 5, score: 2 }),
  ...createCardsOfAllSets({ number: 4, score: 1 })
];

module.exports = cards;
