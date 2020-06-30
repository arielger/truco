import React from "react";
import ReactGA from "react-ga";
import { useLocation } from "react-router-dom";

export const trackEvent = (eventArgs: ReactGA.EventArgs) => {
  if (process.env.REACT_APP_ENVIRONMENT === "PROD") {
    ReactGA.event(eventArgs);
  } else {
    console.log(`📈 Will track event in production environment`, eventArgs);
  }
};

export const trackModalView = (modalName: string) => {
  if (process.env.REACT_APP_ENVIRONMENT === "PROD") {
    ReactGA.modalview(modalName);
  } else {
    console.log(`📈 Will track event in production environment`, modalName);
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
