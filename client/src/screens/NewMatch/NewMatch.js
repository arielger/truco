import React from "react";
import * as R from "ramda";
import Modal from "react-modal";
import gql from "graphql-tag";
import { Formik, Form, Field } from "formik";

import styles from "./NewMatch.module.scss";

const CREATE_MATCH = gql`
  mutation createMatch($playersCount: Int!, $points: Int!) {
    createMatch(playersCount: $playersCount, points: $points) {
      id
    }
  }
`;

export default function NewMatch({ visible, onClose, client, history }) {
  const createNewMatch = matchData => {
    client
      .mutate({
        variables: matchData,
        mutation: CREATE_MATCH
      })
      .then(({ data: { createMatch: { id } } }) => {
        history.push(`/match/${id}`);
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <Modal
      isOpen={visible}
      onRequestClose={onClose}
      className={styles["modal"]}
    >
      <h1 className={styles["title"]}>Nuevo partido</h1>
      <Formik
        initialValues={{ playersCount: 2, points: 30 }}
        onSubmit={(values, { setSubmitting }) => {
          createNewMatch(
            R.evolve({
              playersCount: parseInt,
              points: parseInt
            })(values)
          );
        }}
      >
        {({ values, isSubmitting }) => (
          <Form>
            <div>
              <span>Jugadores:</span>
              <Field component="div" name="playersCount">
                <input
                  type="radio"
                  id="2-players"
                  defaultChecked={values.playersCount === 2}
                  name="playersCount"
                  value={2}
                />
                <label htmlFor="2-players">2 Jugadores</label>
                <input
                  type="radio"
                  id="4-players"
                  defaultChecked={values.playersCount === 4}
                  name="playersCount"
                  value={4}
                />
                <label htmlFor="4-players">4 Jugadores</label>
              </Field>
            </div>

            <div>
              <span>Puntos</span>
              <Field component="div" name="points">
                <input
                  type="radio"
                  id="15-points"
                  defaultChecked={values.points === 15}
                  name="points"
                  value={15}
                />
                <label htmlFor="15-points">15 Puntos</label>
                <input
                  type="radio"
                  id="30-points"
                  defaultChecked={values.points === 30}
                  name="points"
                  value={30}
                />
                <label htmlFor="30-points">30 Puntos</label>
              </Field>
            </div>

            <button type="submit" disabled={isSubmitting}>
              Crear nueva partida
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
