module.exports = function() {
  return {
    files: ["*.js"],

    tests: ["test/**/*.spec.js"],

    env: {
      type: "node"
    }
  };
};
