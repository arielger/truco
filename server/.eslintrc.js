module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: ["airbnb-base", "prettier", "plugin:jest/recommended"],
  plugins: ["prettier", "jest"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  env: {
    "jest/globals": true
  },
  rules: {
    "prettier/prettier": ["error"],
    "class-methods-use-this": "off",
    "no-underscore-dangle": "off",
    "func-names": "off"
  }
};
