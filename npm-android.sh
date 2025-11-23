#!/bin/bash
# Wrapper script to run React Native with project-specific Java

# Source project environment
if [ -f ".env.local" ]; then
    source .env.local
    echo "🔧 Using project Java: $JAVA_HOME"
else
    echo "❌ Project environment file not found!"
    exit 1
fi

# Check Java version
echo "📋 Current Java version for this project:"
java -version

# Run the command
case "$1" in
    "android")
        echo "🚀 Building Android app with Java 17..."
        npx react-native run-android
        ;;
    "build-android")
        echo "🔨 Building Android release with Java 17..."
        npx react-native build-android --mode=release
        ;;
    "doctor")
        echo "🩺 Running React Native doctor with Java 17..."
        npx react-native doctor
        ;;
    *)
        echo "Usage: ./npm-android.sh [android|build-android|doctor]"
        echo ""
        echo "Examples:"
        echo "  ./npm-android.sh android       # Run on Android emulator"
        echo "  ./npm-android.sh build-android # Build release APK"
        echo "  ./npm-android.sh doctor        # Check environment"
        ;;
esac
