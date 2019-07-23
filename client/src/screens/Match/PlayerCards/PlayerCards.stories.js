import React from "react";
import { storiesOf } from "@storybook/react";
import faker from "faker";

import PlayerCards from "./PlayerCards";

const Wrapper = ({ children }) => (
  <div
    style={{
      width: "100%",
      height: "100vh",
      position: "relative"
    }}
  >
    {children}
  </div>
);

const player = {
  name: faker.name.findName(),
  avatar: faker.image.avatar()
};

storiesOf("PlayerCards", module)
  .add("current user cards", () => (
    <Wrapper>
      <PlayerCards
        isCurrentUser={true}
        player={player}
        position="bottom"
        playedCards={[]}
        enablePlayCards={true}
        notPlayedCards={[
          {
            id: 1,
            card: "10-BASTO"
          },
          {
            id: 2,
            card: "1-SWORD"
          },
          {
            id: 3,
            card: "6-CUP"
          }
        ]}
        handlePlayCard={() => {}}
      />
    </Wrapper>
  ))
  .add("top opponent cards (active)", () => (
    <Wrapper>
      <PlayerCards
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
  .add("left opponent cards", () => (
    <Wrapper>
      <PlayerCards
        isCurrentUser={false}
        player={player}
        position="left"
        playedCards={[{}]}
        enablePlayCards={true}
        handlePlayCard={() => {}}
      />
    </Wrapper>
  ))
  .add("right opponent cards", () => (
    <Wrapper>
      <PlayerCards
        isCurrentUser={false}
        player={player}
        position="right"
        playedCards={[{}]}
        enablePlayCards={true}
        handlePlayCard={() => {}}
      />
    </Wrapper>
  ));
