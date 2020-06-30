import React from "react";
import { useMutation, gql } from "@apollo/client";
// import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
// import GoogleLogin from "react-google-login";
// import { faFacebookSquare, faGoogle } from "@fortawesome/free-brands-svg-icons";
import padStart from "pad-start";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExclamationCircle,
  faArrowRight,
  faUsers,
  faLock,
} from "@fortawesome/free-solid-svg-icons";

import Button from "../../components/Button";
import Alert from "../../components/Alert";

import logo from "./truco-logo.svg";
import styles from "./Login.module.scss";

// const ENABLE_SOCIAL_MEDIA = false;

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

type logInResult = {
  token: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
};

const LOG_IN_AS_GUEST = gql`
  mutation LogInAsGuest($name: String!) {
    logInAsGuest(name: $name) {
      token
      user {
        id
        name
      }
    }
  }
`;

// const LOG_IN_WITH_FACEBOOK = gql`
//   mutation LogInWithFacebook($accessToken: String!) {
//     logInWithFacebook(accessToken: $accessToken) {
//       token
//       user {
//         id
//         name
//         avatar
//       }
//     }
//   }
// `;

// const LOG_IN_WITH_GOOGLE = gql`
//   mutation LogInWithGoogle($accessToken: String!) {
//     logInWithGoogle(accessToken: $accessToken) {
//       token
//       user {
//         id
//         name
//         avatar
//       }
//     }
//   }
// `;

export default function Login() {
  const [playerName, setPlayerName] = React.useState(
    `jugador${padStart(getRandomInt(1, 10000), 4, "0")}`
  );

  // # TODO: Improve type signature
  const handleLogIn = (key: string) => (
    cache: any,
    { data }: { data?: any }
  ) => {
    const response = data[key];
    localStorage.setItem("token", response.token);
    cache.writeQuery({
      query: gql`
        query setLoggedInUser {
          user {
            id
            name
            avatar
          }
          token
        }
      `,
      data: { ...response },
    });
  };

  const [
    logInAsGuest,
    { loading: logInAsGuestLoading, error: logInAsGuestError },
  ] = useMutation(LOG_IN_AS_GUEST, {
    variables: { name: playerName },
    update: handleLogIn("logInAsGuest"),
  });
  // const [
  //   logInWithFacebook,
  //   { loading: logInWithFacebookLoading, error: logInWithFacebookError },
  // ] = useMutation(LOG_IN_WITH_FACEBOOK, {
  //   update: handleLogIn("logInWithFacebook"),
  // });
  // const [
  //   logInWithGoogle,
  //   { loading: logInWithGoogleLoading, error: logInWithGoogleError },
  // ] = useMutation(LOG_IN_WITH_GOOGLE, {
  //   update: handleLogIn("logInWithGoogle"),
  // });

  const showError = logInAsGuestError; // || logInWithGoogleError || logInWithFacebookError;

  return (
    <div
      className={`${styles.login} flex flex-col items-center md:justify-center`}
    >
      <div className="flex flex-col items-center flex-grow md:flex-grow-0 justify-center">
        <img
          src={logo}
          alt="Truco.pro logo"
          className="mb-10"
          style={{ width: "209px", height: "91px" }}
        />
        <ul className="flex flex-col space-y-4">
          {[
            { icon: faArrowRight, text: "Juga sin registrarte" },
            { icon: faUsers, text: "Mesas de 2, 4 y 6 jugadores" },
            { icon: faLock, text: "Partidas privadas" },
          ].map(({ icon, text }) => (
            <li className="flex items-center" key={text}>
              <span className="inline-flex items-center justify-center rounded-full bg-orange-500 w-10 h-10 mr-3">
                <FontAwesomeIcon
                  icon={icon}
                  className={`text-lg ${styles.listItem}`}
                />
              </span>
              <span className="text-lg font-medium">{text}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col items-stretch justify-center bg-white mt-auto md:mt-12 p-8 w-full rounded-t md:rounded md:max-w-md">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            logInAsGuest();
          }}
        >
          <input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="px-4 border border-gray-400 rounded-lg w-full h-12 shadow mb-3 text-gray-800 focus:outline-none focus:border-blue-400"
            placeholder="Nombre"
          />
          <Button
            disabled={!playerName.length}
            isLoading={logInAsGuestLoading}
            styleType="primary"
            // className="mb-4"
            type="submit"
          >
            Ingresar
          </Button>
        </form>
        {/* {ENABLE_SOCIAL_MEDIA && (
          <>
            <span className="h-px w-full bg-gray-300 mb-4" />
            <div className="flex items-center space-x-3">
              <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                fields="name,email,picture"
                callback={({ accessToken }: { accessToken: string }) => {
                  logInWithFacebook({ variables: { accessToken } });
                }}
                render={({ onClick, isDisabled, isProcessing }: any) => (
                  <button
                    className={`${styles.facebookBtn} flex-1 h-12 rounded-lg text-white focus:outline-none transition ease-in duration-100`}
                    onClick={onClick}
                    disabled={isDisabled}
                    // loading={logInWithFacebookLoading || isProcessing} // Review when adding social media
                  >
                    <FontAwesomeIcon icon={faFacebookSquare} className="mr-3" />
                    Facebook
                  </button>
                )}
              />
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                onSuccess={(loginResponse: any) => {
                  // GoogleLoginResponseOffline dont have the accessToken prop, review
                  logInWithGoogle({
                    variables: { accessToken: loginResponse.accessToken },
                  });
                }}
                onFailure={(error) => {
                  console.log("Error logging in with google", error);
                }}
                render={({ onClick, disabled }) => (
                  <button
                    className={`${styles.googleBtn} flex-1 h-12 rounded-lg text-white focus:outline-none transition ease-in duration-100`}
                    disabled={disabled || logInWithGoogleLoading}
                    onClick={onClick}
                  >
                    <FontAwesomeIcon icon={faGoogle} className="mr-3" />
                    Google
                  </button>
                )}
              />
            </div>
          </>
        )} */}
        {showError && (
          <Alert
            type="error"
            icon={faExclamationCircle}
            message="Hubo un error al intentar ingresar"
            className="mt-4"
          />
        )}
      </div>
    </div>
  );
}
