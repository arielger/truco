import React from "react";
import { storiesOf } from "@storybook/react";
import faker from "faker";

import OtherPlayer, { Position } from "./OtherPlayer";

const Wrapper = ({ children }: { children: any }) => (
  <div
    style={{
      width: "100%",
      height: "100vh",
      position: "relative",
    }}
  >
    {children}
  </div>
);

const player = {
  id: faker.random.uuid(),
  name: faker.name.findName(),
  avatar: faker.image.avatar(),
  isFromFirstTeam: false,
};

storiesOf("OtherPlayer", module)
  .add("top opponent cards (active)", () => (
    <Wrapper>
      <OtherPlayer
        player={player}
        position={Position.Top}
        playedCards={[]}
        isTheirTurn={true}
      />
    </Wrapper>
  ))
  .add("left opponent cards (with action)", () => (
    <Wrapper>
      <OtherPlayer
        player={player}
        position={Position.Left}
        action={{ playerId: "test-id", type: "ACCEPT" }}
        playedCards={[]}
      />
    </Wrapper>
  ))
  .add("right opponent cards", () => (
    <Wrapper>
      <OtherPlayer player={player} position={Position.Right} playedCards={[]} />
    </Wrapper>
  ));
