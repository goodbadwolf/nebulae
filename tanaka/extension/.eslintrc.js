module.exports = {
  plugin: ["simple-import-sort"],
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/imports": [
      "error",
      {
        groups: [["^react"], ["^@?\\w"], ["@/(.*)"], ["^[./]"]],
      },
    ],
  },
};
