#!/bin/bash
# Simple script to run Chinese Chess app

echo "🎯 Running Chinese Chess App..."

# Navigate to project directory
cd /home/ben/Documents/Personal_Stuff/Chess/ChineseChess

# Set up environment
export ANDROID_HOME=/home/ben/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$JAVA_HOME/bin:$PATH

echo "📱 Checking emulator status..."
adb devices

echo "� Setting up Metro connection..."
adb reverse tcp:8081 tcp:8081

echo "🔄 Cleaning app data..."
adb shell pm clear com.chinesechess 2>/dev/null || echo "App not installed yet"

echo "🚀 Building and launching Chinese Chess app..."
npx react-native run-android --reset-cache

echo "🎮 Chinese Chess app should now be running!"
echo ""
echo "If you still see a blank screen:"
echo "1. Shake the emulator (Ctrl+M) and select 'Reload'"
echo "2. Press 'r' in Metro terminal to reload"
echo "3. Check that Metro is running on http://localhost:8081"