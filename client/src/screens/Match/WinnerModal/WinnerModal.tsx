import React from "react";
import Modal from "react-modal";
import { Link } from "react-router-dom";

import { ReactComponent as WinnerIcon } from "./medal-solid.svg";
import { ReactComponent as MedalIcon } from "./frown-regular.svg";
import styles from "./WinnerModal.module.scss";

export default function WinnerModal({ history, winnerTeam }) {
  return (
    <Modal
      isOpen={true}
      onRequestClose={() => {
        history.replace("/partidas");
      }}
      overlayClassName={styles.overlay}
      className={styles.modal}
    >
      {winnerTeam === "we" ? (
        <WinnerIcon className={styles.winnerIcon} />
      ) : (
        <MedalIcon className={styles.looserIcon} />
      )}
      <h2 className={styles.title}>
        {winnerTeam === "we" ? "¡Has ganado!" : "¡Has perdido!"}
      </h2>
      <Link className={styles.returnLink} to="/partidas">
        Volver al inicio
      </Link>
    </Modal>
  );
}
