module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "env": {
    "browser": true,
    "jasmine": true,
    "node": true
  },
  "plugins": [
    "react"
  ],
  "settings": {
    "import/resolver": {
      "webpack":{
        "config": "webpack.config.babel.js"
      }
    }
  },
  "rules": {
    "import/no-named-as-default": 0,
    "max-len": [1, 100, 2],
    "jsx-quotes": [2, "prefer-single"],
    "func-names": 0,
    "no-underscore-dangle": 0,
    "react/jsx-filename-extension": 0,
    "no-param-reassign":["error", { "props":false}],
    "no-mixed-operators": 0,
  }
};
