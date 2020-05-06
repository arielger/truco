import React from "react";
import { storiesOf } from "@storybook/react";
import faker from "faker";

import OtherPlayer from "./OtherPlayer";

const Wrapper = ({ children }) => (
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
  name: faker.name.findName(),
  avatar: faker.image.avatar(),
};

storiesOf("OtherPlayer", module)
  .add("top opponent cards (active)", () => (
    <Wrapper>
      <OtherPlayer
        isCurrentUser={false}
        player={player}
        position="top"
        playedCards={[{}]}
        enablePlayCards={true}
        handlePlayCard={() => {}}
        isTheirTurn={true}
      />
    </Wrapper>
  ))
  .add("left opponent cards (with action)", () => (
    <Wrapper>
      <OtherPlayer
        isCurrentUser={false}
        player={player}
        position="left"
        action={{ type: "ACCEPT" }}
        playedCards={[{}]}
        enablePlayCards={true}
        handlePlayCard={() => {}}
      />
    </Wrapper>
  ))
  .add("right opponent cards", () => (
    <Wrapper>
      <OtherPlayer
        isCurrentUser={false}
        player={player}
        position="right"
        playedCards={[{}]}
        enablePlayCards={true}
        handlePlayCard={() => {}}
      />
    </Wrapper>
  ));
