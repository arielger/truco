import { getEnvidoFromPlayer } from "./envido";

describe("Envido utils", () => {
  describe("getEnvidoFromPlayer", () => {
    test("if player doesn't have two cards of the same set", () => {
      expect(getEnvidoFromPlayer(["1-SWORD", "4-BASTO", "6-CUP"])).toEqual(6);
    });

    test("if player have two cards of the same set (+20)", () => {
      expect(getEnvidoFromPlayer(["1-SWORD", "2-SWORD", "6-CUP"])).toEqual(23);
    });

    test("if player have two cards of the same set and one of them is 10, 11 or 12", () => {
      expect(getEnvidoFromPlayer(["11-CUP", "2-SWORD", "6-CUP"])).toEqual(26);
    });
  });
});
