import React from "react";
import { storiesOf } from "@storybook/react";
import Scores from "./Scores";

const Wrapper = ({ children }) => (
  <div
    style={{
      width: "100vh",
      height: "100vh",
      position: "relative",
    }}
  >
    {children}
  </div>
);

storiesOf("Scores", module)
  .add("two players", () => (
    <Wrapper>
      <Scores moreThanTwoPlayers={false} myPoints={15} theirPoints={24} />
    </Wrapper>
  ))
  .add("more than two players", () => (
    <Wrapper>
      <Scores moreThanTwoPlayers={true} myPoints={26} theirPoints={18} />
    </Wrapper>
  ));
