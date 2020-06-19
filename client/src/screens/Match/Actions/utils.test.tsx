import { getSayEnvidoActions } from "./utils";

describe("Actions utils", () => {
  describe("2 players", () => {
    test("If it's first player saying envido before playing card", () => {
      expect(
        getSayEnvidoActions({
          envidoPoints: [],
          cardPlayed: false,
          currentPlayerEnvidoPoints: 5,
          playersCount: 2
        })
      ).toEqual(["POINTS"]);
    });

    test("If it's first player saying envido after playing card", () => {
      expect(
        getSayEnvidoActions({
          envidoPoints: [],
          cardPlayed: true,
          currentPlayerEnvidoPoints: 5,
          playersCount: 2
        })
      ).toEqual(["POINTS", "TABLE"]);
    });

    test("If it's second player and have more points", () => {
      expect(
        getSayEnvidoActions({
          envidoPoints: [
            {
              playerId: "1",
              moveType: "POINTS",
              points: 20,
              team: "them"
            }
          ],
          cardPlayed: false,
          currentPlayerEnvidoPoints: 30,
          playersCount: 2
        })
      ).toEqual(["N_ARE_MORE"]);
    });

    test("If it's second player and have less points", () => {
      expect(
        getSayEnvidoActions({
          envidoPoints: [
            {
              playerId: "1",
              moveType: "POINTS",
              points: 20,
              team: "them"
            }
          ],
          cardPlayed: false,
          currentPlayerEnvidoPoints: 5,
          playersCount: 2
        })
      ).toEqual(["CANT_WIN"]);
    });
  });

  // @todo => Add tests for 4 and 6 players
  //   describe("4 players", () => {});
});
