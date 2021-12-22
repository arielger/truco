import React from "react";
import { storiesOf } from "@storybook/react";

import YourCards from "./YourCards";

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

storiesOf("YourCards", module).add("your cards", () => (
  <Wrapper>
    <YourCards
      matchId="match-id"
      enablePlayCards={true}
      notPlayedCards={[
        {
          id: "1",
          card: "10-BASTO",
          played: false,
        },
        {
          id: "2",
          card: "1-SWORD",
          played: false,
        },
        {
          id: "3",
          card: "6-CUP",
          played: false,
        },
      ]}
    />
  </Wrapper>
));
