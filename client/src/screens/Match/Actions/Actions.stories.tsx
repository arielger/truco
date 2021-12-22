import React from "react";
import { storiesOf } from "@storybook/react";
import ActionsList from "./ActionsList";

const Wrapper = ({ children }: { children: any }) => (
  <div
    style={{
      width: "400px",
      height: "100vh",
      position: "relative",
    }}
  >
    {children}
  </div>
);

storiesOf("Actions", module)
  .add("start game actions", () => (
    <Wrapper>
      <ActionsList
        actions={[
          {
            text: "Envido",
            onClick: () => {
              console.log("Play envido");
            },
          },
          {
            text: "Truco",
            onClick: () => {
              console.log("Play truco");
            },
          },
          {
            text: "Irse al mazo",
            onClick: () => {
              console.log("Irse al mazo");
            },
          },
        ]}
      />
    </Wrapper>
  ))
  .add("answer envido", () => (
    <Wrapper>
      <ActionsList
        actions={[
          {
            type: "ACCEPT",
            text: "Quiero",
            onClick: () => {},
          },
          {
            type: "REJECT",
            text: "No quiero",
            onClick: () => {},
          },
          {
            text: "Envido",
            onClick: () => {},
          },
          {
            text: "Real envido",
            onClick: () => {},
          },
          {
            text: "Falta envido",
            onClick: () => {},
          },
        ]}
      />
    </Wrapper>
  ))
  .add("answer truco", () => (
    <Wrapper>
      <ActionsList
        actions={[
          {
            type: "ACCEPT",
            text: "Quiero",
            onClick: () => {
              console.log("Quiero");
            },
          },
          {
            type: "REJECT",
            text: "No quiero",
            onClick: () => {
              console.log("No quiero");
            },
          },
          {
            text: "Envido",
            disabled: true,
            onClick: () => {
              console.log("Envido");
            },
          },
          {
            text: "Retruco",
            onClick: () => {
              console.log("Retruco");
            },
          },
          {
            text: "Irse al mazo",
            onClick: () => {
              console.log("Irse al mazo");
            },
          },
        ]}
      />
    </Wrapper>
  ));
