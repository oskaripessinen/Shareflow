export default ({ config }) => {
  const isExpoGo = process.env.EXPO_GO === 'true';
  
  const basePlugins = [
    "expo-router",
    "expo-font",
    "@react-native-community/datetimepicker"
  ];

  const nativePlugins = [
    "expo-web-browser",
    [
      "@react-native-google-signin/google-signin",
      {
        "iosUrlScheme": "com.googleusercontent.apps.906100274130-8obaj5vjs8cpsv23aeq4edk6v5hb826v"
      }
    ],
    [
      "react-native-vision-camera",
      {
        "cameraPermissionText": "$(PRODUCT_NAME) needs access to your Camera.",
        "enableMicrophonePermission": false,
        "disableFrameProcessors": true
      }
    ]
  ];

  return {
    ...config,
    expo: {
      name: "bolt-expo-nativewind",
      slug: "bolt-expo-nativewind",
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/images/icon.png",
      scheme: "shareflow",
      userInterfaceStyle: "automatic",
      newArchEnabled: false,
      backgroundColor: "#FFFFFF",
      plugins: isExpoGo ? basePlugins : [...basePlugins, ...nativePlugins],
      ios: {
        supportsTablet: true,
        bundleIdentifier: "com.shareflowc.shareflowapp"
      },
      android: {
        package: "com.shareflowc.shareflowapp"
      },
      web: {
        bundler: "metro",
        output: "single",
        favicon: "./assets/images/favicon.png"
      },
      experiments: {
        typedRoutes: true
      },
      extra: {
        router: {},
        eas: {
          projectId: "b019a141-f600-44cd-9963-3f690bd267a5"
        }
      },
      linking: {
        prefixes: [
          "shareflow://",
          "https://shareflow.app",
        ],
      },
    }
  };
};
