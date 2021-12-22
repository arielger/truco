import React from "react";
import * as R from "ramda";
import faker from "faker";
import { storiesOf } from "@storybook/react";
import randomItem from "random-item";

import MatchesList from "./MatchesList";

import { MatchStatus } from "../../types/graphql";

const Wrapper = ({ children }: { children: any }) => (
  <div style={{ padding: 60 }}>{children}</div>
);

const createRandomPlayer = () => ({
  id: faker.random.uuid(),
  name: faker.name.findName(),
  avatar: faker.image.avatar(),
  isFromFirstTeam: true,
});

const createRandomMatch = () => {
  const playersCount = randomItem([2, 4, 6]);

  return {
    creator: createRandomPlayer(),
    id: faker.random.uuid(),
    players: R.times(createRandomPlayer, playersCount),
    playersCount,
    points: randomItem([15, 30]),
    status: MatchStatus.Playing,
  };
};

storiesOf("MatchesList", module)
  .add("loading", () => (
    <MatchesList loading={true} subscribeToUpdates={() => () => {}} />
  ))
  .add("with matches", () => (
    <Wrapper>
      <MatchesList
        loading={false}
        matches={R.times(createRandomMatch, 10)}
        subscribeToUpdates={() => () => {}}
      />
    </Wrapper>
  ));
