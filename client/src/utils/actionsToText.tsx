const actionsToText: { [actionType: string]: string } = {
  ACCEPT: "Quiero",
  REJECT: "No quiero",
  TRUCO: "Truco",
  RETRUCO: "Retruco",
  VALE_CUATRO: "Vale cuatro",
  ENVIDO: "Envido",
  REAL_ENVIDO: "Real envido",
  FALTA_ENVIDO: "Falta envido",
  POINTS: "Tengo {{points}}",
  CANT_WIN: "Son buenas",
  TABLE: "Mesa",
  N_ARE_MORE: "{{points}} son mejores",
  LEAVE_ROUND: "Irse al mazo",
};

export default actionsToText;
