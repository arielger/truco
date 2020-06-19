import React from "react";
import * as R from "ramda";

import styles from "./Actions.module.scss";

const ActionButton = ({ type, className = "", ...props }) => (
  <button
    {...props}
    className={`
      flex-1 whitespace-no-wrap py-3 px-2 text-sm inline-flex items-center justify-center text-gray-100 border-none transition-colors duration-200 focus:outline-none
      ${className}
      ${styles.actionButton}
      ${
        type === "ACCEPT"
          ? "bg-green-500 hover:bg-green-400 focus:bg-green-400"
          : type === "REJECT"
          ? "bg-red-600 hover:bg-red-500 focus:bg-red-500"
          : styles.actionButtonBg
      }
    `}
  ></button>
);

export default function ActionsList({
  actions = [], // { type: String, text: String, onClick: Function, disabled: Boolean }
}) {
  const [topActions, bottomActions] = R.partition(
    (action) => action.type === "ACCEPT" || action.type === "REJECT",
    actions
  );

  return (
    <div className="flex flex-col items-center absolute bottom-0 left-0 right-0 z-10">
      <div className="flex justify-center items-center w-full">
        {topActions.map((action) => (
          <ActionButton
            key={action.text}
            type={action.type}
            disabled={action.disabled}
            onClick={action.onClick}
            className={`px-8`}
          >
            {action.text}
          </ActionButton>
        ))}
      </div>
      <div className={`${styles.actionsBar} flex items-center w-full z-10`}>
        {bottomActions.map((action) => (
          <ActionButton
            key={action.text}
            type={action.type}
            disabled={action.disabled}
            onClick={action.onClick}
            className={`flex-1`}
          >
            {action.text}
          </ActionButton>
        ))}
      </div>
    </div>
  );
}
