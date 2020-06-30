import { configure, addDecorator } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import apolloStorybookDecorator from "apollo-storybook-react";

import "../src/styles/tailwind.css";

addDecorator(StoryRouter());

// Only add typeDefs so we don't get an error
addDecorator(
  apolloStorybookDecorator({
    typeDefs: `
    type Query {
      test: String
    }

    schema {
      query: Query
    }
  `,
    mocks: {},
  })
);

// automatically import all files ending in *.stories.js
const req = require.context("../src", true, /\.stories\.tsx$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
