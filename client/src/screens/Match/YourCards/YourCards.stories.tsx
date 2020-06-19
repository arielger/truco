import React from "react";
import { storiesOf } from "@storybook/react";
import faker from "faker";

import YourCards from "./YourCards";

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

storiesOf("YourCards", module).add("your cards", () => (
  <Wrapper>
    <YourCards
      isCurrentUser={true}
      player={player}
      position="bottom"
      playedCards={[]}
      enablePlayCards={true}
      notPlayedCards={[
        {
          id: 1,
          card: "10-BASTO",
        },
        {
          id: 2,
          card: "1-SWORD",
        },
        {
          id: 3,
          card: "6-CUP",
        },
      ]}
      handlePlayCard={() => {}}
    />
  </Wrapper>
));
