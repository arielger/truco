import React from "react";
import ReactGA from "react-ga";
import { useLocation } from "react-router-dom";

export const trackEvent = (...args) => {
  if (process.env.REACT_APP_ENVIRONMENT === "PROD") {
    ReactGA.event(...args);
  } else {
    console.log(`📈 Will track event in production environment`, args);
  }
};

export const trackModalView = (...args) => {
  if (process.env.REACT_APP_ENVIRONMENT === "PROD") {
    ReactGA.modalview(...args);
  } else {
    console.log(`📈 Will track event in production environment`, args);
  }
};

export default function UserTracking() {
  const location = useLocation();

  React.useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GOOGLE_ANALYTICS_KEY);
  }, []);

  const pageUrl = location.pathname + location.search;

  React.useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      ReactGA.pageview(pageUrl);
    } else {
      console.log(
        `📈 Will track pageview to ${pageUrl} in production environment`
      );
    }
  }, [pageUrl]);

  return <span />;
}
