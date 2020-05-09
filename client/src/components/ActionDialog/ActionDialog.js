import React from "react";

import styles from "./ActionDialog.module.scss";
import actionsToText from "../../utils/actionsToText.json";

export default function ActionDialog({
  action,
  position = "top", // "top" | "bottom"
}) {
  return (
    <div
      className={`
        ${styles.actionDialog}
        ${styles[position]}
        absolute bg-white rounded-md px-4 py-2 uppercase font-bold text-gray-800 whitespace-no-wrap transform left-1/2 -translate-x-1/2
      `}
    >
      {["POINTS", "N_ARE_MORE"]
        ? actionsToText[action.type].replace("{{points}}", action.points)
        : actionsToText[action.type]}
    </div>
  );
}
