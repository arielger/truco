import React from "react";
import * as R from "ramda";
import Modal from "react-modal";
import { Formik, Form } from "formik";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useMutation, gql } from "@apollo/client";
import { useHistory } from "react-router-dom";

import styles from "./NewMatch.module.scss";

import { trackEvent } from "../../components/UserTracking";
import Alert from "../../components/Alert";
import Button from "../../components/Button";
import Radio from "./Radio";

const CREATE_MATCH = gql`
  mutation createMatch($playersCount: Int!, $points: Int!) {
    createMatch(playersCount: $playersCount, points: $points) {
      id
    }
  }
`;

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function NewMatch({ visible, onClose }: Props) {
  const history = useHistory();

  const [createMatch, { loading, error }] = useMutation(CREATE_MATCH, {
    onCompleted: (data) => {
      // @TODO => Load match data to cache so we don't need to execute the match query when
      // moving to the match page
      const newMatchId = R.path(["createMatch", "id"], data);
      history.push(`/partidas/${newMatchId}`);
    },
  });

  return (
    <Modal
      isOpen={visible}
      onRequestClose={onClose}
      className={`bg-white w-full sm:max-w-sm mx-6 p-6 rounded text-black -mt-16 ${styles.modal}`}
      overlayClassName={`w-screen h-screen flex justify-center items-center fixed inset-0 ${styles.modalOverlay}`}
    >
      <h1 className="text-2xl text-gray-800 text-center mb-4 font-medium">
        Nueva partida
      </h1>
      <Formik
        initialValues={{ playersCount: "2", points: "30" }}
        onSubmit={(values, { setSubmitting }) => {
          // Transform strings to int
          const matchConfig = R.evolve({
            playersCount: parseInt,
            points: parseInt,
          })(values);

          trackEvent({
            category: "Matches",
            action: "Create a new match",
          });

          createMatch({ variables: matchConfig });
        }}
      >
        {({ values, isSubmitting }) => {
          return (
            <Form>
              <div className="mb-5">
                <span className="text-base inline-block font-medium mb-2">
                  Jugadores:
                </span>
                <div className="flex flex-col space-y-2">
                  {[
                    { value: "2", disabled: false },
                    { value: "4", disabled: true },
                    { value: "6", disabled: true },
                  ].map(({ value, disabled }) => (
                    <Radio
                      key={value}
                      id={`${value}-players`}
                      name="playersCount"
                      text={`${value} jugadores`}
                      value={value}
                      className="mt-0"
                      disabled={disabled}
                    />
                  ))}
                </div>
              </div>
              <div>
                <span className="text-base inline-block font-medium mb-2">
                  Puntos:
                </span>
                <div className="flex flex-col space-y-2">
                  {["30", "15"].map((points) => (
                    <Radio
                      key={points}
                      id={`${points}-points`}
                      name="points"
                      value={points}
                      text={`${points} puntos`}
                    />
                  ))}
                </div>
              </div>

              <Button
                styleType="primary"
                type="submit"
                disabled={isSubmitting}
                className="mt-8"
                isLoading={loading}
              >
                Crear
              </Button>
              {error && (
                <Alert
                  type="error"
                  icon={faExclamationCircle}
                  message="Hubo un error al intentar ingresar"
                  className="mt-4"
                />
              )}
            </Form>
          );
        }}
      </Formik>
    </Modal>
  );
}
