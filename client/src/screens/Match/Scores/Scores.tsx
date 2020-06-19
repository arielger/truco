import React from "react";

const TeamScore = ({ text, points }) => {
  return (
    <div
      style={{ backgroundColor: "#4F4F4F" }}
      className="flex items-center justify-between rounded py-1 px-2 text-sm relative"
    >
      <span className="font-medium">{text}</span>
      <span className="font-semibold">{points}</span>
    </div>
  );
};

export default function Scores({
  // matchPoints,
  myPoints,
  theirPoints,
  moreThanTwoPlayers,
}) {
  return (
    <div className="flex flex-col w-20 m-3 space-y-2">
      <TeamScore text={moreThanTwoPlayers ? "Nos" : "Yo"} points={myPoints} />
      <TeamScore
        text={moreThanTwoPlayers ? "Ellos" : "Él"}
        points={theirPoints}
      />
    </div>
  );
}
