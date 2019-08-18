const {
  isValidEnvidoAction,
  getRoundEnvidoPoints,
  getEnvidoFromPlayer,
  getEnvidoWinnerTeam
} = require("./envido");

describe("Envido utilities", () => {
  describe("Check if action is valid", () => {
    test("should only be able to accept or reject if envido is pending", () => {
      expect(
        isValidEnvidoAction({
          action: "ACCEPT",
          roundEnvido: {
            list: ["ENVIDO"],
            status: "ACCEPTED"
          }
        })
      ).toBe(false);
      expect(
        isValidEnvidoAction({
          action: "ACCEPT",
          roundEnvido: {
            list: ["ENVIDO", "ENVIDO", "REAL_ENVIDO"],
            status: "PENDING"
          }
        })
      ).toBe(true);
    });

    test("should not be able to play REAL ENVIDO or FALTA ENVIDO if it's already played", () => {
      expect(
        isValidEnvidoAction({
          action: "FALTA_ENVIDO",
          roundEnvido: {
            list: ["FALTA_ENVIDO"],
            status: "PENDING"
          }
        })
      ).toBe(false);
      expect(
        isValidEnvidoAction({
          action: "REAL_ENVIDO",
          roundEnvido: {
            list: ["FALTA_ENVIDO"],
            status: "PENDING"
          }
        })
      ).toBe(false);
      expect(
        isValidEnvidoAction({
          action: "REAL_ENVIDO",
          roundEnvido: {
            list: ["ENVIDO"],
            status: "PENDING"
          }
        })
      ).toBe(true);
    });

    test("should only be able to play envido two times", () => {
      expect(
        isValidEnvidoAction({
          action: "ENVIDO",
          roundEnvido: {
            list: ["ENVIDO", "ENVIDO"],
            status: "PENDING"
          }
        })
      ).toBe(false);
      expect(
        isValidEnvidoAction({
          action: "ENVIDO",
          roundEnvido: {
            list: ["ENVIDO"],
            status: "PENDING"
          }
        })
      ).toBe(true);
    });
  });

  describe("Get round envido points", () => {
    test("return the correct amount of points if envido is rejected", () => {
      const testGetRoundEnvidoPoints = (envidoList, expectedResult) => {
        expect(
          getRoundEnvidoPoints({
            envidoList,
            isAccepted: false,
            pointsFirstTeam: 0,
            pointsSecondTeam: 0
          })
        ).toBe(expectedResult);
      };

      testGetRoundEnvidoPoints(["ENVIDO"], 1);
      testGetRoundEnvidoPoints(["REAL_ENVIDO"], 1);
      testGetRoundEnvidoPoints(["FALTA_ENVIDO"], 1);
      testGetRoundEnvidoPoints(["ENVIDO", "ENVIDO"], 2);
      testGetRoundEnvidoPoints(["REAL_ENVIDO", "FALTA_ENVIDO"], 3);
      testGetRoundEnvidoPoints(["ENVIDO", "ENVIDO", "REAL_ENVIDO"], 4);
      testGetRoundEnvidoPoints(["ENVIDO", "REAL_ENVIDO", "FALTA_ENVIDO"], 5);
      testGetRoundEnvidoPoints(
        ["ENVIDO", "ENVIDO", "REAL_ENVIDO", "FALTA_ENVIDO"],
        7
      );
    });

    test("return the correct amount of points if envido is accepted", () => {
      const testGetRoundEnvidoPoints = (envidoList, expectedResult, props) => {
        expect(
          getRoundEnvidoPoints({
            envidoList,
            isAccepted: true,
            pointsFirstTeam: 0,
            pointsSecondTeam: 0,
            ...props
          })
        ).toBe(expectedResult);
      };

      testGetRoundEnvidoPoints(["ENVIDO"], 2);
      testGetRoundEnvidoPoints(["REAL_ENVIDO"], 3);
      testGetRoundEnvidoPoints(["ENVIDO", "ENVIDO"], 4);
      testGetRoundEnvidoPoints(["ENVIDO", "ENVIDO", "REAL_ENVIDO"], 7);

      testGetRoundEnvidoPoints(["FALTA_ENVIDO"], 30);
      testGetRoundEnvidoPoints(["FALTA_ENVIDO"], 10, {
        pointsFirstTeam: 20,
        pointsSecondTeam: 5
      });
    });
  });

  test("Get envido points from player", () => {
    expect(getEnvidoFromPlayer(["10-GOLD", "11-CUP", "12-BASTO"])).toBe(0);
    expect(getEnvidoFromPlayer(["10-GOLD", "11-GOLD", "12-BASTO"])).toBe(20);
    expect(getEnvidoFromPlayer(["3-SWORD", "4-GOLD", "12-BASTO"])).toBe(4);
    expect(getEnvidoFromPlayer(["3-SWORD", "4-SWORD", "12-BASTO"])).toBe(27);
    expect(getEnvidoFromPlayer(["3-SWORD", "10-BASTO", "12-BASTO"])).toBe(20);
    expect(getEnvidoFromPlayer(["3-SWORD", "4-SWORD", "5-SWORD"])).toBe(29);
    expect(getEnvidoFromPlayer(["6-SWORD", "7-SWORD", "5-BASTO"])).toBe(33);
  });

  describe("Get envido winner team", () => {
    test("Get envido winner team", () => {
      expect(
        getEnvidoWinnerTeam([
          {
            playerId: "1",
            isFromFirstTeam: true,
            moveType: "POINTS",
            points: 28
          },
          {
            playerId: "1",
            isFromFirstTeam: false,
            moveType: "POINTS",
            points: 33
          }
        ])
      ).toBe("second");

      expect(
        getEnvidoWinnerTeam([
          {
            playerId: "1",
            isFromFirstTeam: false,
            moveType: "POINTS",
            points: 4
          },
          {
            playerId: "2",
            isFromFirstTeam: true,
            moveType: "CANT_WIN"
          },
          {
            playerId: "3",
            isFromFirstTeam: false,
            moveType: "POINTS",
            points: 24
          },
          {
            playerId: "4",
            isFromFirstTeam: true,
            moveType: "POINTS",
            points: 28
          }
        ])
      ).toBe("first");

      // If same points => should win the first
      expect(
        getEnvidoWinnerTeam([
          {
            playerId: "1",
            isFromFirstTeam: true,
            moveType: "POINTS",
            points: 33
          },
          {
            playerId: "2",
            isFromFirstTeam: false,
            moveType: "POINTS",
            points: 33
          }
        ])
      ).toBe("first");
    });
  });
});
