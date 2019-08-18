import React from "react";
import { storiesOf } from "@storybook/react";
import ActionsList from "./ActionsList";

const Wrapper = ({ children }) => (
  <div
    style={{
      width: "100vh",
      height: "100vh",
      backgroundColor: "#131418",
      position: "relative"
    }}
  >
    {children}
  </div>
);

storiesOf("Actions", module)
  .add("start game actions", () => (
    <Wrapper>
      <ActionsList
        envidoActions={["ENVIDO", "REAL_ENVIDO", "FALTA_ENVIDO"]}
        trucoActions={["TRUCO"]}
      />
    </Wrapper>
  ))
  .add("answer envido action", () => (
    <Wrapper>
      <ActionsList
        actionToAnswerTo="ENVIDO"
        envidoActions={[
          "ACCEPT",
          "REJECT",
          "ENVIDO",
          "REAL_ENVIDO",
          "FALTA_ENVIDO"
        ]}
      />
    </Wrapper>
  ))
  .add("answer truco action", () => (
    <Wrapper>
      <ActionsList
        theirAction="TRUCO"
        envidoActions={["ACCEPT", "REJECT", "RETRUCO"]}
      />
    </Wrapper>
  ))
  .add("answer envido action", () => (
    <Wrapper>
      <ActionsList
        theirAction="ENVIDO"
        envidoActions={[
          "ACCEPT",
          "REJECT",
          "ENVIDO",
          "REAL_ENVIDO",
          "FALTA_ENVIDO"
        ]}
      />
    </Wrapper>
  ))
  .add("wait for truco response", () => (
    <Wrapper>
      <ActionsList ourAction="TRUCO" />
    </Wrapper>
  ))
  .add("say envido can't win", () => (
    <Wrapper>
      <ActionsList sayEnvidoActions={["CANT_WIN"]} />
    </Wrapper>
  ))
  .add("say envido points", () => (
    <Wrapper>
      <ActionsList sayEnvidoActions={["POINTS"]} envidoPoints={33} />
    </Wrapper>
  ));
