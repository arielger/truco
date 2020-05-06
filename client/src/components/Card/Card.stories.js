import React from "react";
import { storiesOf } from "@storybook/react";

import cards from "../../utils/cards";

import Card from "./Card";

const Wrapper = ({ children }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      width: "100%",
      height: "100vh",
      position: "relative",
      margin: "24px",
    }}
  >
    {children}
  </div>
);

storiesOf("Card", module)
  .add("list of all cards", () => (
    <Wrapper>
      {cards.map(({ card }) => (
        <Card card={card} />
      ))}
    </Wrapper>
  ))
  .add("list of all cards (disabled)", () => (
    <Wrapper>
      {cards.map(({ card }) => (
        <Card card={card} isDisabled={true} />
      ))}
    </Wrapper>
  ))
  .add("placeholder", () => (
    <Wrapper>
      <Card isPlaceholder={true} />
    </Wrapper>
  ));
