#!/bin/bash
# Comprehensive cleanup script for React Native development

echo "🧹 Starting comprehensive cleanup..."

# Navigate to project directory
cd /home/ben/Documents/Personal_Stuff/Chess/ChineseChess

# Set up environment
export ANDROID_HOME=/home/ben/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$JAVA_HOME/bin:$PATH

echo "🔄 Step 1: Stopping all running processes..."
# Kill Metro bundler
pkill -f "react-native start" || echo "Metro not running"
pkill -f "node.*metro" || echo "Metro not running"

# Stop ADB server
adb kill-server 2>/dev/null || echo "ADB not running"

echo "🗑️  Step 2: Cleaning React Native caches..."
# Clear Metro cache
npx react-native start --reset-cache &
sleep 3
pkill -f "react-native start"

# Clear npm cache
npm cache clean --force

# Clear watchman cache (if installed)
watchman watch-del-all 2>/dev/null || echo "Watchman not installed"

echo "🧼 Step 3: Cleaning Android build files..."
# Clean Gradle build
cd android
./gradlew clean 2>/dev/null || echo "Gradle clean skipped"
cd ..

# Remove build directories
rm -rf android/build
rm -rf android/app/build
rm -rf node_modules/.cache

echo "📱 Step 4: Cleaning emulator data..."
adb start-server
sleep 2

# Check if emulator is running
if adb devices | grep -q "device$"; then
    echo "Emulator found - cleaning app data..."
    adb shell pm clear com.chinesechess 2>/dev/null || echo "App not installed"
    adb shell pm uninstall com.chinesechess 2>/dev/null || echo "App not installed"
else
    echo "No emulator running - skipping app cleanup"
fi

echo "🔧 Step 5: Resetting development environment..."
# Clear temporary files
rm -rf /tmp/react-*
rm -rf /tmp/metro-*

echo "✅ Cleanup complete!"
echo ""
echo "📋 Summary of what was cleaned:"
echo "  ✓ Metro bundler processes stopped"
echo "  ✓ ADB server reset"
echo "  ✓ Metro cache cleared"
echo "  ✓ NPM cache cleared"
echo "  ✓ Android build files removed"
echo "  ✓ App data cleared from emulator"
echo "  ✓ Temporary files removed"
echo ""
echo "🚀 Ready for a fresh start!"
echo "Next steps:"
echo "  1. Start emulator if not running"
echo "  2. Run: ./launch-app.sh"