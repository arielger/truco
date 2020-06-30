import React from "react";
import { storiesOf } from "@storybook/react";

import ActionDialog from "./ActionDialog";

const Wrapper = ({ children }: { children: any }) => (
  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      width: "100%",
      height: "100vh",
      position: "relative",
      margin: "24px",
      alignItems: "flex-start",
    }}
  >
    {children}
  </div>
);

storiesOf("ActionDialog", module).add("top", () => (
  <Wrapper>
    <ActionDialog action={{ type: "ACCEPT" }} />
  </Wrapper>
));
