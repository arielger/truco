import React from "react";
import { Link } from "react-router-dom";
import Spinner from "react-svg-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

import styles from "./MatchesList.module.scss";

import { getRandomAvatar } from "../../utils/player";

export default function MatchesList({
  subscribeToUpdates,
  matches,
  loading,
  error
}) {
  if (loading)
    return (
      <div className={styles.loading}>
        <Spinner color="rgba(255,255,255, 0.5)" size="32px" />
        <span>Cargando partidas</span>
      </div>
    );
  if (error) return <p>Error :(</p>;

  React.useEffect(() => {
    const unsubscribe = subscribeToUpdates();
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="flex flex-col">
      {matches.map(match => (
        <Link to={`/match/${match.id}`} key={match.id} className="inline-block text-black mb-3">
          <div className="flex bg-white rounded-t p-2 items-center">
            <img
              className="w-8 h-8 rounded-full mr-2 bg-gray-400 hide-text"
              src={match.creator.avatar || getRandomAvatar(32, match.creator.name)}
              alt={`${match.creator.name} avatar`}
            />
            <h2 className="font-medium truncate"> {match.creator.name}</h2>
          </div>
          <div className="flex justify-between items-center bg-gray-200 rounded-b h-12 px-4">
            <div className="flex items-center whitespace-no-wrap">
              <FontAwesomeIcon icon={faStar} className="text-orange-400" />
              <span className="ml-2 text-gray-600 text-sm font-medium">{match.points} puntos</span>
            </div>
            <div className="flex items-center">
              <span className="mr-2 text-gray-800 text-sm font-medium">
                {match.players.length}/{match.playersCount}
              </span>
              <div className="flex items-center">
                {match.players.map((player, index) => (
                  <img
                    className={`${styles.playerAvatar} ${match.players.length === index + 1 ? "" : " -mr-2"} w-6 h-6 rounded-full border-2 border-gray-200 bg-gray-400`}
                    key={player.name}
                    src={player.avatar || getRandomAvatar(32, player.name)}
                    alt={`${player.name} avatar`}
                  />
                ))}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
