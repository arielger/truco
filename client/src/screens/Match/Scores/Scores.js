import React from "react";
import cs from "classnames";
import * as R from "ramda";

import styles from "./Scores.module.scss";

const getTeamPointsGroups = (teamPoints, matchPoints) => {
  const points = teamPoints > matchPoints ? matchPoints : teamPoints;
  const isMatchFinished = points === matchPoints;
  const completedGroups = Math.floor(points / 5);
  const remainingPoints = !isMatchFinished && points % 5;
  return R.pipe(
    R.splitEvery(3),
    R.when(lists => lists.length === 2, R.intersperse({ isSeparator: true })),
    R.flatten
  )([
    ...Array(completedGroups).fill({ points: 5 }),
    ...(isMatchFinished ? [] : [{ points: remainingPoints }]),
    ...Array(6 - (completedGroups + (isMatchFinished ? 0 : 1))).fill({
      points: 0
    })
  ]);
};

const PointsGroup = ({ teamPoints, matchPoints }) =>
  getTeamPointsGroups(teamPoints, matchPoints).map(
    ({ points, isSeparator }, index) => {
      if (isSeparator)
        return <div key="separator" className={styles.separator} />;
      return (
        <div
          key={index}
          className={cs(styles.pointsGroup, {
            [styles.borderLeft]: points >= 1,
            [styles.borderTop]: points >= 2,
            [styles.borderBottom]: points >= 3,
            [styles.borderRight]: points >= 4,
            [styles.borderMiddle]: points === 5
          })}
        />
      );
    }
  );

// @todo: Add animation to new points
export default function Scores({
  matchPoints,
  myPoints,
  theirPoints,
  moreThanTwoPlayers
}) {
  return (
    <div className={styles.scores}>
      <div className={styles.player}>
        <h2 className={styles.playerTitle}>
          {moreThanTwoPlayers ? "Nos" : "Yo"}
        </h2>
        <PointsGroup teamPoints={myPoints} matchPoints={matchPoints} />
      </div>
      <div className={styles.player}>
        <h2 className={styles.playerTitle}>
          {moreThanTwoPlayers ? "Ellos" : "Él"}
        </h2>
        <PointsGroup teamPoints={theirPoints} matchPoints={matchPoints} />
      </div>
    </div>
  );
}
