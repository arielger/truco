import React from "react";
import { ApolloConsumer } from "react-apollo";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import GoogleLogin from "react-google-login";
import gql from "graphql-tag";
import cs from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookSquare, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

import styles from "./Login.module.scss";

const LOG_IN_AS_GUEST = gql`
  mutation LogInAsGuest {
    logInAsGuest {
      token
      user {
        name
        avatar
      }
    }
  }
`;

const LOG_IN_WITH_FACEBOOK = gql`
  mutation LogInWithFacebook($accessToken: String!) {
    logInWithFacebook(accessToken: $accessToken) {
      token
      user {
        name
        avatar
      }
    }
  }
`;

const LOG_IN_WITH_GOOGLE = gql`
  mutation LogInWithGoogle($accessToken: String!) {
    logInWithGoogle(accessToken: $accessToken) {
      token
      user {
        name
        avatar
      }
    }
  }
`;

export default function Login() {
  const logInAnonymously = client => {
    client
      .mutate({
        mutation: LOG_IN_AS_GUEST
      })
      .then(({ data: { logInAsGuest: { token, user } } }) => {
        localStorage.setItem("token", token);
        client.writeData({ data: { isLoggedIn: true, token } });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const logInWithFacebook = (client, accessToken) => {
    client
      .mutate({
        mutation: LOG_IN_WITH_FACEBOOK,
        variables: { accessToken }
      })
      .then(({ data: { logInWithFacebook: { token } } }) => {
        localStorage.setItem("token", token);
        client.writeData({ data: { isLoggedIn: true, token } });
      })
      .catch(error => {
        console.log(error);
      });
  };

  const logInWithGoogle = (client, accessToken) => {
    client
      .mutate({
        mutation: LOG_IN_WITH_GOOGLE,
        variables: { accessToken }
      })
      .then(({ data: { logInWithGoogle: { token } } }) => {
        localStorage.setItem("token", token);
        client.writeData({ data: { isLoggedIn: true, token } });
      })
      .catch(error => {
        console.log(error);
      });
  };

  return (
    <div className={styles.login}>
      <h1>Truco.io</h1>
      <div className={styles.modal}>
        <h2 className={styles.loginTitle}>Login</h2>
        <ApolloConsumer>
          {client => (
            <>
              <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                fields="name,email,picture"
                callback={({ accessToken }) => {
                  logInWithFacebook(client, accessToken);
                }}
                render={({ onClick }) => (
                  <button
                    className={cs([styles.socialLoginBtn, styles.facebook])}
                    onClick={onClick}
                  >
                    <FontAwesomeIcon
                      icon={faFacebookSquare}
                      className={styles.loginIcon}
                    />
                    Ingresar con Facebook
                  </button>
                )}
              />
              <GoogleLogin
                clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                onSuccess={({ accessToken }) =>
                  logInWithGoogle(client, accessToken)
                }
                onFailure={error => {
                  console.log("Error logging in with google", error);
                }}
                render={({ onClick, disabled }) => (
                  <button
                    className={cs([styles.socialLoginBtn, styles.google])}
                    disabled={disabled}
                    onClick={onClick}
                  >
                    <FontAwesomeIcon
                      icon={faGoogle}
                      className={styles.loginIcon}
                    />
                    Ingresar con Google
                  </button>
                )}
              />

              <button
                className={cs([styles.socialLoginBtn, styles.anonymous])}
                type="submit"
                onClick={() => logInAnonymously(client)}
              >
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className={styles.loginIcon}
                />
                Ingresar anonimamente
              </button>
            </>
          )}
        </ApolloConsumer>
      </div>
    </div>
  );
}
