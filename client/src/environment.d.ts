// Solution from
// https://stackoverflow.com/questions/45194598/using-process-env-in-typescript

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        REACT_APP_API_URL: string;
        REACT_APP_SUBSCRIPTIONS_URL: string;
        REACT_APP_GOOGLE_ANALYTICS_KEY: string;
        NODE_ENV: 'development' | 'production';
        PORT?: string;
        PWD: string;
      }
    }
  }
  
  // If this file has no import/export statements (i.e. is a script)
  // convert it into a module by adding an empty export statement.
  export {}