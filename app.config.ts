import { ConfigContext, ExpoConfig } from "@expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  "name": "HackNet",
  "slug": "HackNet",
  "version": "1.0.1",
  "orientation": "portrait",
  "icon": "./assets/images/icon.png",
  "scheme": "hacknet",
  "userInterfaceStyle": "automatic",
  "newArchEnabled": true,
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "com.shibamroy.hacknet",
    "buildNumber": "2",
  },
  "android": {
    "adaptiveIcon": {
      "foregroundImage": "./assets/images/adaptive-icon/foreground.png",
      "backgroundColor": "#17171d"
    },
    "versionCode": 2,
    "edgeToEdgeEnabled": true,
    "googleServicesFile": process.env.GOOGLE_SERVICES_JSON ?? "./google-services.json",
    "permissions": [
      "android.permission.RECORD_AUDIO"
    ],
    "package": "com.shibamroy.hacknet"

  },
  "notification": {
    "icon": "./assets/images/notification-icon.png",
    "color": "#ec3750"
  },
  "web": {
    "bundler": "metro",
    "output": "static",
    "favicon": "./assets/images/favicon.png"
  },
  "plugins": [
    "expo-audio",
    [
      "expo-notifications",
      {
        "icon": "./assets/images/notification-icon.png",
        "color": "#ec3750",
        "defaultChannel": "default",
        "sounds": [
          "./assets/sounds/notification_ping.mp3",
        ],
        "enableBackgroundRemoteNotifications": true
      }
    ],
    [
      "expo-image-picker",
      {
        "photosPermission": "The app accesses your photos to make posts, or to customize profile"
      }
    ],
    "expo-router",
    [
      "expo-splash-screen",
      {
        "image": "./assets/images/splash.png",
        "imageWidth": 200,
        "resizeMode": "contain",
        "backgroundColor": "#17171d"
      }
    ],
    "expo-web-browser",
    [
      "expo-video",
      {
        "supportsBackgroundPlayback": true,
        "supportsPictureInPicture": true
      }
    ],
    [
      "expo-font",
      {
        "fonts": [
          "./assets/fonts/PhantomSans-Regular.otf"
        ],
        "android": {
          "fonts": [
            {
              "fontFamily": "PhantomSans",
              "fontDefinitions": [
                {
                  "path": "./assets/fonts/PhantomSans-Regular.otf",
                  "weight": 400,
                  "style": "normal"
                },
                {
                  "path": "./assets/fonts/PhantomSans-Italic.otf",
                  "weight": 400,
                  "style": "italic"
                },
                {
                  "path": "./assets/fonts/PhantomSans-Bold.otf",
                  "weight": 700
                }
              ]
            }
          ]
        },
        "ios": {
          "fonts": [
            "./assets/fonts/PhantomSans-Regular.otf",
            "./assets/fonts/PhantomSans-Bold.otf",
            "./assets/fonts/PhantomSans-Italic.otf"
          ]
        }
      }
    ]
  ],
  "experiments": {
    "typedRoutes": true
  },
  "extra": {
    "router": {},
    "eas": {
      "projectId": "14749a4f-8461-4113-8c2b-238775dfce1c"
    }
  }
});