import React from "react";
import { storiesOf } from "@storybook/react";
import faker from "faker";

import WinnerModal from "./WinnerModal";

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

storiesOf("WinnerModal", module)
  .add("winner", () => (
    <Wrapper>
      <WinnerModal winnerTeam="we" />
    </Wrapper>
  ))
  .add("looser", () => (
    <Wrapper>
      <WinnerModal winnerTeam="them" />
    </Wrapper>
  ));
