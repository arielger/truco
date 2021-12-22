const mongoose = require("mongoose");

// Need to register schema to use it
require("../database/models/match");
require("../database/models/user");

const { getNewRoundData } = require("../utils/round.js");

const MatchDatasource = require("./match.js");

const Match = mongoose.model("Match");

const currentUserId = String(mongoose.Types.ObjectId()); // Need to convert to string for eq comparison
let newMatchId;

async function createMatch({ roundData = {} } = {}) {
  const newMatch = await new Match({
    status: "playing",
    playersCount: 2,
    points: 30,
    creator: currentUserId,
    players: [
      { data: currentUserId, isFromFirstTeam: true }, // Player is from first team
      { data: mongoose.Types.ObjectId(), isFromFirstTeam: true },
    ],
    rounds: [
      {
        ...getNewRoundData([
          mongoose.Types.ObjectId(),
          mongoose.Types.ObjectId(),
        ]),
        ...roundData,
      },
    ],
  }).save();

  newMatchId = newMatch.id;
}

describe("MatchAPI", () => {
  beforeAll(async () => {
    await mongoose.connect(
      process.env.MONGO_URL,
      { useNewUrlParser: true, useCreateIndex: true },
      (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      }
    );
  });

  afterEach(async () => {
    await Match.deleteMany({});
  });

  describe("leaveRound", () => {
    test("should not be able to leave round if is not next player", async () => {
      await createMatch();

      const matchDatasource = new MatchDatasource();

      await expect(
        matchDatasource.leaveRound({
          matchId: newMatchId,
          userId: currentUserId,
        })
      ).rejects.toThrow(/NOT_NEXT_PLAYER/);
    });

    test("should add envido points to score if its pending", async () => {
      await createMatch({
        roundData: {
          nextPlayer: currentUserId,
          envido: {
            status: "PENDING",
            list: ["ENVIDO", "ENVIDO", "REAL_ENVIDO"], // 4 points from ENVIDO + ENVIDO
            isFromFirstTeam: true,
          },
        },
      });

      const matchDatasource = new MatchDatasource();

      await matchDatasource.leaveRound({
        matchId: newMatchId,
        userId: currentUserId,
      });

      const updatedMatch = await Match.findById(newMatchId);

      // Player leaving the round is from first team so it should add the points to the second team
      // 4 envido points + 1 from truco
      expect(updatedMatch.pointsSecondTeam).toBe(5);
    });

    test("should add truco points to score if it was played", async () => {
      await createMatch({
        roundData: {
          nextPlayer: currentUserId,
          truco: {
            type: "RETRUCO",
            status: "ACCEPTED",
            isFromFirstTeam: true,
            hand: 1,
          },
        },
      });

      const matchDatasource = new MatchDatasource();

      await matchDatasource.leaveRound({
        matchId: newMatchId,
        userId: currentUserId,
      });

      const updatedMatch = await Match.findById(newMatchId);

      // Player leaving the round is from first team so it should add the points to the second team
      // 3 points from truco, 0 from envido
      expect(updatedMatch.pointsSecondTeam).toBe(3);
    });

    test("", () => {
      
    });
  });
});
