import React from "react";
import { Prompt } from "react-router-dom";

export default function Match({ match }) {
  return (
    <div>
      <Prompt message="Estas seguro que quieres abandonar la partida?" />
      <h1>Match {match.params.matchId}</h1>
    </div>
  );
}
