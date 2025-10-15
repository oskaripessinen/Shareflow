# Shareflow

Shareflow is a React Native (Expo, TypeScript) app for shared and personal finances and investments. It uses Expo Router for navigation, Zustand for state, and NativeWind for styling. Current focus: groups and invites, portfolio tracking with historical price fetch, and UI with modals and platform date pickers.

## Features
- Authentication: Google login.
- Groups: create/select groups, invite members via email (invite flow).
- Expenses/Income: forms and shared ledger (in progress).
- Investments: add holdings, fetch historical purchase prices, allocation (pie) and performance (line) charts.
- UI/UX: react-native-modal sheets, iOS date picker with Accept action, SVG icons.
- Cross-platform: iOS and Android via Expo/EAS.

## Tech Stack
- React Native, Expo, TypeScript
- Expo Router (file-based navigation)
- Zustand (state)
- NativeWind (Tailwind for RN)
- react-native-modal, react-native-svg
- VisionCamera, Worklets Core

## Project Structure
```
app/
  _layout.tsx
  +not-found.tsx
  create_group.tsx
  index.tsx
  invite.tsx
  login.tsx
  (tabs)/
    _layout.tsx
    expenses.tsx
    income.tsx
    index.tsx
    investments.tsx
components/...
```

## Getting Started
1) Requirements
- Node.js LTS (recommend nvm)
- Expo CLI: npm i -g expo

2) Install
```bash
npm install
```

3) Start
```bash
npx expo start
```

## Scripts / Running
- start:expo-go
  - Run in the Expo Go app. Custom native modules are NOT available, so features using Google Sign-In native SDK and react-native-vision-camera are disabled.
- start (Development Build)
  - Use with a Dev Client (expo-dev-client) to enable native modules. First build a dev client:
    - iOS: npx expo run:ios
    - Android: npx expo run:android
  - Then run: npx expo start and open with the Dev Client.

## Babel Configuration (NativeWind + no Reanimated v4)
Use this to avoid plugin conflicts and make modals/rendering reliable:
```javascript
// babel.config.js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', { reanimated: false }],
    ],
    plugins: [
      'nativewind/babel',
      'expo-router/babel',
      // If you use VisionCamera/Worklets Core, also add:
      // 'react-native-worklets-core/plugin',
    ],
  };
};
```

After changes, clear caches:
```bash
rm -rf node_modules/.cache/metro .expo
npx expo start -c
```


