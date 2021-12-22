import React from "react";

import { Action } from "../../types/graphql";

import styles from "./ActionDialog.module.scss";
import actionsToText from "../../utils/actionsToText";

type Props = {
  action: Pick<Action, "type" | "points">;
  position?: "top" | "bottom";
};

export default function ActionDialog({ action, position = "top" }: Props) {
  const actionText = actionsToText[action.type];

  return (
    <div
      className={`
        ${styles.actionDialog}
        ${styles[position]}
        absolute bg-white rounded-md px-4 py-2 uppercase font-bold text-gray-800 whitespace-no-wrap transform left-1/2 -translate-x-1/2
      `}
    >
      {["POINTS", "N_ARE_MORE"].includes(action.type)
        ? actionText.replace(
            "{{points}}",
            action.points ? String(action.points) : ""
          )
        : actionText}
    </div>
  );
}
