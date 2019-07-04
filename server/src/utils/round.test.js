const { getPlayersInPlayingOrder, isLastPlayerFromTeam } = require("./round");

describe("Round utilities", () => {
  test("Get players in playing order", () => {
    const players = [1, 2, 3, 4];
    expect(getPlayersInPlayingOrder(0)(players)).toStrictEqual([1, 2, 3, 4]);
    expect(getPlayersInPlayingOrder(1)(players)).toStrictEqual([2, 3, 4, 1]);
    expect(getPlayersInPlayingOrder(2)(players)).toStrictEqual([3, 4, 1, 2]);
  });

  describe("Is last player from team", () => {
    const mockedMatchData = {
      players: [
        { data: "user-id-1" },
        { data: "user-id-2" },
        { data: "user-id-3" },
        { data: "user-id-4" }
      ],
      rounds: [
        {
          hands: [
            {
              initialPlayerIndex: 4
            },
            {
              initialPlayerIndex: 0
            }
          ]
        }
      ]
    };

    test("should return true if it's the last player of the current hand", () => {
      expect(isLastPlayerFromTeam(mockedMatchData, "user-id-3")).toBe(true);
      expect(isLastPlayerFromTeam(mockedMatchData, "user-id-4")).toBe(true);
    });

    test("should return false if it's NOT the last player of the current hand", () => {
      expect(isLastPlayerFromTeam(mockedMatchData, "user-id-1")).toBe(false);
      expect(isLastPlayerFromTeam(mockedMatchData, "user-id-2")).toBe(false);
    });
  });
});
