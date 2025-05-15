module.exports = function (api) {
  api.cache(true)
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
    plugins: [
      // POISTETTU: ['module:react-native-dotenv', { … }]
      // voit lisätä tähän muita plugin-rivistöjä tarpeen mukaan
    ]
  }
}