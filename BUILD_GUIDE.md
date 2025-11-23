# Chinese Chess - Build and Deployment Guide

## Building for Development

### Prerequisites
1. **Node.js** (v16 or higher)
2. **React Native CLI**: `npm install -g @react-native-community/cli`
3. **For Android**: Android Studio with SDK 28+
4. **For iOS**: Xcode 12+ (macOS only)

### Development Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start Metro bundler**:
   ```bash
   npm start
   ```

3. **Run on Android**:
   ```bash
   # Make sure Android emulator is running or device is connected
   npm run android
   ```

4. **Run on iOS**:
   ```bash
   # Make sure iOS simulator is running (macOS only)
   npm run ios
   ```

## Building for Production

### Android APK/Bundle

1. **Generate a signing key**:
   ```bash
   cd android/app
   keytool -genkeypair -v -storetype PKCS12 -keystore chinesechess-release-key.keystore -alias chinesechess-key-alias -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure signing** in `android/gradle.properties`:
   ```
   CHINESECHESS_UPLOAD_STORE_FILE=chinesechess-release-key.keystore
   CHINESECHESS_UPLOAD_KEY_ALIAS=chinesechess-key-alias
   CHINESECHESS_UPLOAD_STORE_PASSWORD=***
   CHINESECHESS_UPLOAD_KEY_PASSWORD=***
   ```

3. **Add signing config** to `android/app/build.gradle`:
   ```gradle
   android {
       ...
       signingConfigs {
           release {
               if (project.hasProperty('CHINESECHESS_UPLOAD_STORE_FILE')) {
                   storeFile file(CHINESECHESS_UPLOAD_STORE_FILE)
                   storePassword CHINESECHESS_UPLOAD_STORE_PASSWORD
                   keyAlias CHINESECHESS_UPLOAD_KEY_ALIAS
                   keyPassword CHINESECHESS_UPLOAD_KEY_PASSWORD
               }
           }
       }
       buildTypes {
           release {
               ...
               signingConfig signingConfigs.release
           }
       }
   }
   ```

4. **Build release APK**:
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

5. **Build App Bundle** (for Google Play):
   ```bash
   cd android
   ./gradlew bundleRelease
   ```

### iOS IPA

1. **Open in Xcode**:
   ```bash
   cd ios && xed .
   ```

2. **Configure signing**:
   - Select your project in Xcode
   - Go to "Signing & Capabilities"
   - Select your team and configure provisioning profiles

3. **Archive for distribution**:
   - Product → Archive
   - Distribute App → App Store Connect / Ad Hoc / Enterprise

## App Store Deployment

### Google Play Store (Android)

1. **Prepare store listing**:
   - App title: "Chinese Chess"
   - Description: Include features and game rules
   - Screenshots: Gameplay, piece movement, game features
   - Category: Games → Board

2. **Upload App Bundle**:
   - Use the generated `.aab` file from `android/app/build/outputs/bundle/release/`

3. **App permissions**:
   - Internet (for future online features)

### Apple App Store (iOS)

1. **App Store Connect setup**:
   - Create new app with bundle ID
   - Configure app information and pricing

2. **Upload IPA**:
   - Use Xcode Archive → Distribute
   - Or use Application Loader / Transporter

3. **App Review Information**:
   - Provide gameplay instructions
   - Mention it's a traditional Chinese Chess game
   - No special hardware requirements

## Performance Optimization

### Bundle Size Optimization

1. **Enable Proguard** (Android):
   ```gradle
   android {
       buildTypes {
           release {
               minifyEnabled true
               proguardFiles getDefaultProguardFile("proguard-android.txt"), "proguard-rules.pro"
           }
       }
   }
   ```

2. **Split APKs by architecture**:
   ```gradle
   android {
       splits {
           abi {
               enable true
               reset()
               include "x86", "armeabi-v7a", "arm64-v8a"
           }
       }
   }
   ```

3. **Enable Hermes** (JavaScript engine):
   ```javascript
   // metro.config.js
   module.exports = {
     transformer: {
       hermesCommand: './node_modules/hermes-engine/%OS-BIN%/hermes',
     },
   };
   ```

### Testing

1. **Unit Tests**:
   ```bash
   npm test
   ```

2. **E2E Testing**:
   - Install Detox for React Native
   - Test critical game flows

3. **Performance Testing**:
   - Test on various device configurations
   - Monitor memory usage during gameplay
   - Ensure smooth animations

## CI/CD Pipeline

### GitHub Actions Example

```yaml
name: Build and Deploy

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
      with:
        node-version: '16'
    - run: npm install
    - run: npm test

  build-android:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
    - uses: actions/setup-java@v2
      with:
        java-version: '11'
    - run: npm install
    - run: cd android && ./gradlew assembleRelease

  build-ios:
    needs: test
    runs-on: macos-latest
    steps:
    - uses: actions/checkout@v2
    - uses: actions/setup-node@v2
    - run: npm install
    - run: cd ios && xcodebuild -workspace ChineseChess.xcworkspace -scheme ChineseChess archive
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**:
   ```bash
   npx react-native start --reset-cache
   ```

2. **Android build issues**:
   ```bash
   cd android && ./gradlew clean
   ```

3. **iOS pod issues**:
   ```bash
   cd ios && pod deintegrate && pod install
   ```

### Device Compatibility

- **Minimum Android**: API 21 (Android 5.0)
- **Minimum iOS**: iOS 11.0
- **Supported orientations**: Portrait and Landscape
- **Screen sizes**: Phone and tablet optimized

---

The app is now ready for production deployment with proper configuration for both Android and iOS platforms.