#!/bin/bash
# Simple script to run Chinese Chess app in emulator

echo "🎯 Starting Chinese Chess App Test..."

# Set up environment
export ANDROID_HOME=/home/ben/Android/Sdk
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$ANDROID_HOME/emulator:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools:$JAVA_HOME/bin:$PATH

cd /home/ben/Documents/Personal_Stuff/Chess/ChineseChess

echo "🔧 Environment setup complete"
echo "📋 Java: $JAVA_HOME"
echo "📋 Android SDK: $ANDROID_HOME"

# Kill any existing emulator
echo "🧹 Cleaning up old processes..."
pkill -f emulator 2>/dev/null
adb kill-server 2>/dev/null
sleep 2

# Start ADB server
echo "🚀 Starting ADB server..."
adb start-server

# Start emulator
echo "📱 Starting emulator..."
emulator -avd Medium_Phone_API_36.1 -no-snapshot-save &
EMULATOR_PID=$!

echo "⏳ Waiting for emulator to boot (this may take 1-2 minutes)..."

# Wait for device to be ready
timeout=120  # 2 minutes
elapsed=0
while [ $elapsed -lt $timeout ]; do
    if adb devices | grep -q "device$"; then
        echo "✅ Emulator is online!"
        break
    fi
    sleep 5
    elapsed=$((elapsed + 5))
    echo "⏳ Still waiting... ($elapsed seconds)"
done

if [ $elapsed -ge $timeout ]; then
    echo "❌ Emulator took too long to start. Try running manually:"
    echo "   1. Open Android Studio"
    echo "   2. Go to Tools → AVD Manager"
    echo "   3. Start Medium_Phone_API_36.1"
    exit 1
fi

# Run the app
echo "🎮 Installing Chinese Chess app..."
./npm-android.sh android

echo "🎉 App should now be running on your emulator!"