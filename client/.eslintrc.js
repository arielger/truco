module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    "react-app",
    "prettier",
    "prettier/react",
    "plugin:prettier/recommended",
  ],
  plugins: ["prettier"],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    "prettier/prettier": ["error"],
    "class-methods-use-this": "off",
    "no-underscore-dangle": "off",
    "func-names": "off",
  },
};
