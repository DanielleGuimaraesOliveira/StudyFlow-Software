module.exports = {
    root: true,
    env:{
        browser: true,
        node:true,
        es2021: true
    },
    ignorePatterns: ["node_modules/","build/"],
    extends: [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ],
    parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
    rules: {
    "no-unused-vars": "warn",
        "no-undef": "error",
    "no-console": "warn",
    "no-debugger": "warn",

    "max-len": ["warn", { code: 100 }],
    "semi": ["error", "never"],
    "quotes": ["error", "single"],
},
  overrides: [
    {
      files: ["api/**/*"],
      env: { node: true },
    },
    {
      files: ["web/**/*"],
      env: { browser: true },
    },
    {
      files: ["shared/**/*"],
      env: { browser: true, node: true },
    }
  ],

}