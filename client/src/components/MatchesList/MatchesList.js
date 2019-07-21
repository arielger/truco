import React from "react";
import { Link } from "react-router-dom";
import Spinner from "react-svg-spinner";

import styles from "./MatchesList.module.scss";

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
    <div className={styles.matches}>
      {matches.map(match => (
        <Link to={`/match/${match.id}`} className={styles.match} key={match.id}>
          <div className={styles.matchHeader}>
            <img
              className={styles.creatorAvatar}
              src={match.creator.avatar}
              alt={`${match.creator.name} avatar`}
            />
            <div>
              <h2 className={styles.creatorName}>{match.creator.name}</h2>
              <span>{match.points} puntos</span>
            </div>
          </div>
          <div>
            <span className={styles.playersTitle}>
              Jugadores ({match.players.length}/{match.playersCount})
            </span>
            <div className={styles["avatars"]}>
              {match.players.map((player, index) => (
                <img
                  key={player.name}
                  className={styles.playerAvatar}
                  src={player.avatar}
                  alt={`${player.name} avatar`}
                  style={{
                    zIndex: match.players.length - index,
                    left: index * -8
                  }}
                />
              ))}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
