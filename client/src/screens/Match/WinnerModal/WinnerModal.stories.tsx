import React from "react";
import { storiesOf } from "@storybook/react";

import WinnerModal from "./WinnerModal";

import { Team } from "../../../types/graphql";

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

storiesOf("WinnerModal", module)
  .add("winner", () => (
    <Wrapper>
      <WinnerModal winnerTeam={Team.We} />
    </Wrapper>
  ))
  .add("looser", () => (
    <Wrapper>
      <WinnerModal winnerTeam={Team.Them} />
    </Wrapper>
  ));
