module.exports = function(wallaby) {
  return {
    files: ["*.js"],

    tests: ["test/**/*.spec.js"],

    env: {
      type: "node"
    },

    compilers: {
      "**/*.js": wallaby.compilers.babel({
        babel: require("babel-core")
      })
    }
  };
};
