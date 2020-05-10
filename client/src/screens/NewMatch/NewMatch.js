import React from "react";
import * as R from "ramda";
import Modal from "react-modal";
import { Formik, Form, Field } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useMutation, gql } from "@apollo/client";

import styles from "./NewMatch.module.scss";

import Alert from "../../components/Alert";
import Button from "../../components/Button";

const CREATE_MATCH = gql`
  mutation createMatch($playersCount: Int!, $points: Int!) {
    createMatch(playersCount: $playersCount, points: $points) {
      id
    }
  }
`;

const Radio = ({ id, text, className = "", disabled, ...props }) => (
  <>
    <Field type="radio" id={id} {...props}>
      {({ field }) => {
        const isChecked = field.checked;

        return (
          <div className="relative">
            <input
              type="radio"
              id={id}
              className="opacity-0 absolute"
              disabled={disabled}
              {...field}
            />
            <label
              htmlFor={id}
              className={`
                ${styles.radioLabel}
                h-10 w-full rounded border flex items-center justify-between px-3
                ${
                  disabled
                    ? "text-gray-600 cursor-not-allowed border-gray-300"
                    : "text-black cursor-pointer border-gray-400"
                }
                ${className}
              `}
            >
              <div className="flex items-center">
                <span
                  className={`
                  ${styles.iconContainer}
                  w-5 h-5 mr-3 text-sm rounded-full inline-flex items-center justify-center
                  ${disabled ? "bg-gray-200" : "bg-gray-300"}
              `}
                >
                  {isChecked && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{ fontSize: "0.625em" }}
                      className={`${styles.radioIcon} text-white`}
                    />
                  )}
                </span>
                <span className="text-sm whitespace-no-wrap">{text}</span>
              </div>
              {disabled && (
                <span
                  className={`inline-block font-medium text-white rounded-full px-3 uppercase bg-orange-500 ${styles.comingSoon}`}
                >
                  Proximamente
                </span>
              )}
            </label>
          </div>
        );
      }}
    </Field>
  </>
);

export default function NewMatch({ visible, onClose, history }) {
  const [createMatch, { loading, error }] = useMutation(CREATE_MATCH, {
    onCompleted: (data) => {
      // @TODO => Load match data to cache so we don't need to execute the match query when
      // when moving to the match page
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
          createMatch({
            variables: R.evolve({
              playersCount: parseInt,
              points: parseInt,
            })(values),
          });
        }}
      >
        {({ values, isSubmitting }) => {
          return (
            <Form>
              <div className="mb-5">
                <span className="text-base inline-block font-medium mb-2">
                  Jugadores:
                </span>
                <div name="playersCount" className="flex flex-col space-y-2">
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
                <div name="points" className="flex flex-col space-y-2">
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
