import * as R from "ramda";
import React from "react";
import Modal from "react-modal";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Prompt } from "react-router-dom";
import {
  faStar,
  faSeedling,
  faHourglassHalf,
  faMeh,
} from "@fortawesome/free-solid-svg-icons";
import gql from "graphql-tag";
import { useMutation } from "react-apollo";

import { getRandomAvatar } from "../../../utils/player";

import styles from "./WaitingState.module.scss";

import Button from "../../../components/Button";

const JOIN_MATCH = gql`
  mutation joinMatch($matchId: ID!) {
    joinMatch(matchId: $matchId) {
      id
    }
  }
`;

const LEAVE_MATCH = gql`
  mutation leaveMatch($matchId: ID!) {
    leaveMatch(matchId: $matchId) {
      success
      message
    }
  }
`;

function CreatorLeftModal({ isVisible, history }) {
  return (
    <Modal
      isOpen={isVisible}
      className={`bg-white w-full sm:max-w-sm mx-6 p-6 rounded text-black -mt-16 flex flex-col items-center ${styles.modal}`}
      overlayClassName={`w-screen h-screen flex justify-center items-center fixed inset-0 ${styles.modalOverlay}`}
    >
      <span className="w-12 h-12 rounded-full inline-flex items-center justify-center bg-orange-200 mb-3">
        <FontAwesomeIcon icon={faMeh} className="text-orange-500 text-xl" />
      </span>
      <span className="text-medium text-gray-700 text-center mb-6">
        Parece que el creador de la partida abandonó el juego
      </span>
      <Button
        onClick={() => {
          history.push("/partidas");
        }}
      >
        Volver al listado
      </Button>
    </Modal>
  );
}

// @TODO: Add storybook stories

export default function WaitingState({
  userId,
  matchId,
  players,
  points,
  playersCount,
  creator,
  isCreator,
  joinedMatch,
  showCreatorLeft,
}) {
  const history = useHistory();
  const [joinMatch] = useMutation(JOIN_MATCH, { variables: { matchId } });
  const [leaveMatch] = useMutation(LEAVE_MATCH, { variables: { matchId } });

  // @TODO: Fix React.useEffect, sometimes it is not executing leaveMatch
  React.useEffect(() => {
    return () => {
      if (joinedMatch && !showCreatorLeft) {
        leaveMatch();
      }
    };
  }, []); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Prompt
        when={joinedMatch && !showCreatorLeft}
        message={`Estas seguro que deseas abandonar la partida?`}
      />
      <CreatorLeftModal isVisible={showCreatorLeft} history={history} />
      <div className="max-w-md mx-auto w-full p-6">
        {isCreator ? (
          <h2 className="font-medium text-3xl mb-2">Tú partida:</h2>
        ) : (
          <>
            <span className="inline-block mb-1">Partida de:</span>
            <div className="flex items-center mb-4">
              <img
                alt={`${creator.name} avatar`}
                src={creator.avatar || getRandomAvatar(creator.name)}
                className="mr-3 w-8 h-8 rounded-full bg-gray-400"
              />
              <h2 className="font-medium text-3xl">{creator.name}</h2>
            </div>
          </>
        )}
        <div className="flex items-center mb-6">
          <span
            className="border rounded-full px-4 h-8 inline-flex items-center text-sm mr-2"
            style={{ borderColor: "#373A3E" }}
          >
            <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-2" />
            <span>{points} puntos</span>
          </span>
          <span
            className="border rounded-full px-4 h-8 inline-flex text-sm items-center"
            style={{ borderColor: "#373A3E" }}
          >
            <FontAwesomeIcon
              icon={faSeedling}
              className="text-orange-400 mr-2"
            />
            <span>Sin flor</span>
          </span>
        </div>
        <div className="flex items-center text-white bg-orange-500 rounded h-10 px-4 whitespace-no-wrap mb-10">
          <FontAwesomeIcon icon={faHourglassHalf} className="mr-3" />
          <span className="text-white font-medium text-sm">
            Esperando jugadores para empezar
          </span>
        </div>
        <div className="mb-10">
          <h2 className="font-medium text-xl mb-5">Jugadores</h2>
          <div className="flex flex-col items-stretch relative">
            <span className="absolute right-0 top-0 font-medium -mt-8">
              {players.length} / {playersCount}
            </span>
            <div className="flex flex-col items-stretch space-y-3">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center rounded bg-white h-12 px-3"
                >
                  <img
                    alt={`${player.name} avatar`}
                    src={player.avatar || getRandomAvatar(player.name)}
                    className="w-6 h-6 rounded-full mr-3 bg-gray-400"
                  />
                  <span className="text-black font-medium">{player.name}</span>
                  {userId === player.id && (
                    <span className="ml-1 text-xs text-gray-500 font-medium">
                      (Tú)
                    </span>
                  )}
                  {creator.id === player.id && (
                    <span
                      className="font-medium inline-flex items-center justify-center bg-red-500 uppercase rounded-full ml-auto"
                      style={{ fontSize: "0.625em", padding: "0.125rem 1rem" }}
                    >
                      Creador
                    </span>
                  )}
                </div>
              ))}
              {R.times(
                (i) => (
                  <span
                    key={i}
                    className="h-12 border border-dashed rounded"
                    style={{ borderColor: "rgba(255,255,255, 0.2)" }}
                  ></span>
                ),
                playersCount - players.length
              )}
            </div>
          </div>
        </div>
        {joinedMatch ? (
          <button
            onClick={() => {
              // If WaitingState is unmounted we will execute leaveMatch
              history.push("/partidas");
            }}
            className="flex items-center justify-center rounded text-red-500 font-medium h-12 border-2 border-red-500 w-full hover:text-red-400 hover:border-red-400"
          >
            Abandonar partida
          </button>
        ) : (
          <Button styleType="primary" onClick={joinMatch}>
            Unirse
          </Button>
        )}
      </div>
    </>
  );
}
