import React from "react";

// import styles from "./Scores.module.scss";

// @todo: Add animation to new points
export default function Scores({ matchPoints, myPoints, theirPoints }) {
  return (
    <div>
      <h2>
        Nosotros: {myPoints}/{matchPoints}
      </h2>
      <h2>
        Ellos: {theirPoints}/{matchPoints}
      </h2>
    </div>
  );
}
