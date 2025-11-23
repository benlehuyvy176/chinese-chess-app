# Chinese Chess (Xiangqi) React Native App - Complete Setup Guide

## Project Overview
This is a complete Chinese Chess (Xiangqi) mobile application built with React Native and TypeScript, featuring:
- Traditional Chinese chess game rules and piece movements
- Cross-platform support (Android and iOS)
- Beautiful Chinese-style game board interface
- Full game state management with undo functionality
- Move validation and game status tracking

## 🚀 Quick Start (Project-Specific Java Environment)

### Prerequisites Completed
- ✅ React Native project created with TypeScript template
- ✅ Complete game engine implemented
- ✅ Mobile UI components built
- ✅ Project-specific Java 17 environment configured
- ✅ Android Studio installed

### Running the App

1. **Start Metro Bundler:**
   ```bash
   ./npm-android.sh start
   ```

2. **Build and Run on Android:**
   ```bash
   ./npm-android.sh android
   ```

3. **Check Environment Status:**
   ```bash
   ./npm-android.sh doctor
   ```

## 🛠️ Complete Setup Process

### 1. Initial Project Creation
```bash
npx @react-native-community/cli@latest init ChineseChess --template react-native-template-typescript
cd ChineseChess
```

### 2. Game Implementation
The app includes these key components:
- **Game Engine** (`src/game/engine.ts`): Complete Xiangqi rules implementation
- **Game Board** (`src/components/GameBoard.tsx`): Traditional Chinese chess UI
- **Game Screen** (`src/screens/GameScreen.tsx`): Main game interface
- **Type System** (`src/types/index.ts`): Full TypeScript definitions

### 3. Java Version Management (Project-Specific)
**Problem:** React Native requires Java 17-20, but system uses Java 21 for other projects.

**Solution:** Project-specific Java environment that doesn't affect other projects.

#### Files Created:
- `.env.local` - Project environment variables
- `npm-android.sh` - Wrapper script for Android commands
- Updated `android/gradle.properties` and `android/local.properties`

#### Environment Setup Script:
```bash
# Run this to set up project-specific Java 17
./setup-project-java.sh
```

### 4. Android Development Environment
1. **Android Studio Installation:**
   ```bash
   sudo snap install android-studio --classic
   ```

2. **Launch Android Studio:**
   ```bash
   android-studio
   ```

3. **Complete Android Studio Setup:**
   - Follow the setup wizard
   - Install Android SDK (API level 34 recommended)
   - Create an Android Virtual Device (AVD)

## 🔧 Build Configuration

### Java Environment
- **System Java:** Java 21 (unchanged)
- **Project Java:** Java 17 (isolated to this project only)
- **Gradle Configuration:** Uses project-specific Java path

### Key Configuration Files
1. **android/gradle.properties:**
   ```properties
   org.gradle.java.home=/usr/lib/jvm/java-17-openjdk-amd64
   ```

2. **android/local.properties:**
   ```properties
   sdk.dir=/home/ben/Android/Sdk
   ```

3. **.env.local:**
   ```bash
   export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
   export ANDROID_HOME=/home/ben/Android/Sdk
   export PATH=$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$PATH
   ```

## 📱 Game Features

### Implemented Functionality
- ✅ Complete Xiangqi piece movements and rules
- ✅ Traditional Chinese board layout (9x10)
- ✅ Piece selection and move highlighting
- ✅ Game state management (ongoing, check, checkmate, stalemate)
- ✅ Move history and undo functionality
- ✅ Turn-based gameplay
- ✅ Chinese character piece representation

### Game Rules Implemented
- General (King) palace movement and protection
- Advisor diagonal palace movement
- Elephant field restriction and blocking
- Horse movement with blocking pieces
- Chariot (Rook) straight-line movement
- Cannon jumping capture mechanics
- Soldier promotion after river crossing

## 🐛 Troubleshooting

### Common Issues and Solutions

1. **Java Version Conflicts:**
   - **Issue:** "Unsupported Java. Your build is currently configured to use Java X"
   - **Solution:** Use `./npm-android.sh` commands instead of direct `npm` commands

2. **Android SDK Not Found:**
   - **Issue:** ANDROID_HOME not set or SDK missing
   - **Solution:** Complete Android Studio setup and install SDK components

3. **No Connected Devices:**
   - **Issue:** No Android emulator or device available
   - **Solution:** Create AVD in Android Studio or connect physical device

### Verification Commands
```bash
# Check Java version (should show Java 17 in project)
source .env.local && java -version

# Check React Native environment
./npm-android.sh doctor

# Test Metro bundler
./npm-android.sh start
```

## 🎯 Next Steps After Android Studio Setup

1. **Complete Android Studio First-Time Setup:**
   - Install Android SDK Platform (API 34)
   - Install Android SDK Build-Tools
   - Install Android Emulator
   - Accept Android SDK licenses

2. **Create Android Virtual Device:**
   - Open AVD Manager in Android Studio
   - Create a new virtual device (Pixel 6 recommended)
   - Download system image (API 34, x86_64)

3. **Test the Complete Setup:**
   ```bash
   # Start emulator first, then:
   ./npm-android.sh doctor  # Should show all green checks
   ./npm-android.sh android # Should build and install the app
   ```

## 📂 Project Structure
```
ChineseChess/
├── src/
│   ├── components/
│   │   ├── GameBoard.tsx      # Main game board UI
│   │   └── PieceComponent.tsx # Individual piece rendering
│   ├── game/
│   │   ├── board.ts           # Board utilities
│   │   ├── engine.ts          # Core game engine
│   │   └── moves.ts           # Move validation
│   ├── screens/
│   │   └── GameScreen.tsx     # Main game screen
│   ├── types/
│   │   └── index.ts           # TypeScript definitions
│   └── utils/
│       └── index.ts           # Helper functions
├── android/                   # Android-specific files
├── ios/                       # iOS-specific files (for future)
├── .env.local                 # Project environment (Java 17)
├── npm-android.sh             # Android wrapper script
└── setup-project-java.sh      # Java environment setup
```

## 🎮 How to Play

1. Launch the app on your Android device/emulator
2. Red pieces move first (traditional Chinese chess rules)
3. Tap a piece to select it, tap a valid square to move
4. The goal is to checkmate the opponent's General (King)
5. Use the "Undo" button to take back the last move
6. Game status is displayed at the top of the screen

## 🔄 Development Workflow

```bash
# Start development server
./npm-android.sh start

# Run on Android (in separate terminal)
./npm-android.sh android

# Run tests
./npm-android.sh test

# Check for issues
./npm-android.sh doctor
```

## ✅ Status Summary

- **Core Game:** 100% Complete ✅
- **Mobile UI:** 100% Complete ✅
- **Android Config:** 100% Complete ✅
- **Java Environment:** Isolated Java 17 Setup Complete ✅
- **Android Studio:** Installed, Setup Required ⚠️
- **Ready to Test:** After Android Studio setup completion ⏳

---

**Note:** This setup maintains Java 17 only for this React Native project while preserving your system's Java 21 for other projects. All commands use the `./npm-android.sh` wrapper to ensure the correct Java environment.