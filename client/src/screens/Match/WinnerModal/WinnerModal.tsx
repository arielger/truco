import React from "react";
import Modal from "react-modal";
import { Link, useHistory } from "react-router-dom";

import { ReactComponent as WinnerIcon } from "./medal-solid.svg";
import { ReactComponent as MedalIcon } from "./frown-regular.svg";
import styles from "./WinnerModal.module.scss";

import { Team } from "../../../types/graphql";

export default function WinnerModal({ winnerTeam }: { winnerTeam: Team }) {
  const history = useHistory();

  return (
    <Modal
      isOpen={true}
      onRequestClose={() => {
        history.replace("/partidas");
      }}
      overlayClassName={styles.overlay}
      className={styles.modal}
    >
      {winnerTeam === Team.We ? (
        <WinnerIcon className={styles.winnerIcon} />
      ) : (
        <MedalIcon className={styles.looserIcon} />
      )}
      <h2 className={styles.title}>
        {winnerTeam === Team.We ? "¡Has ganado!" : "¡Has perdido!"}
      </h2>
      <Link className={styles.returnLink} to="/partidas">
        Volver al inicio
      </Link>
    </Modal>
  );
}
