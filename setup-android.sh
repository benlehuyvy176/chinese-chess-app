#!/bin/bash

# 🔧 Quick Android Setup Script for Chinese Chess App
# This script helps fix the most common Android build issues

echo "🎯 Chinese Chess Android Build Fix Script"
echo "========================================="
echo ""

# Check current Java version
echo "📋 Checking current Java version..."
java -version
echo ""

# Check if compatible JDK is available
if java -version 2>&1 | grep -q "openjdk version \"2[1-9]"; then
    echo "❌ Current Java version is too new for React Native"
    echo "   React Native requires JDK 17-20, but found JDK 21+"
    echo ""
    echo "🔧 To fix this, run:"
    echo "   sudo apt update"
    echo "   sudo apt install openjdk-17-jdk"
    echo "   sudo update-alternatives --config java"
    echo ""
elif java -version 2>&1 | grep -q "openjdk version \"1[7-9]\\|openjdk version \"20"; then
    echo "✅ Java version is compatible with React Native"
    echo ""
else
    echo "❓ Java version check inconclusive. Please ensure JDK 17-20 is installed."
    echo ""
fi

# Check for Android SDK
echo "📋 Checking Android SDK..."
if [ -d "$HOME/Android/Sdk" ]; then
    echo "✅ Android SDK found at: $HOME/Android/Sdk"
    
    # Update local.properties with correct path
    LOCAL_PROPS="android/local.properties"
    if [ -f "$LOCAL_PROPS" ]; then
        if grep -q "sdk.dir=/home/$(whoami)/Android/Sdk" "$LOCAL_PROPS"; then
            echo "✅ local.properties already configured correctly"
        else
            echo "🔧 Updating local.properties with correct SDK path..."
            echo "sdk.dir=$HOME/Android/Sdk" > "$LOCAL_PROPS"
            echo "✅ Updated local.properties"
        fi
    fi
else
    echo "❌ Android SDK not found at: $HOME/Android/Sdk"
    echo "   Please install Android Studio first"
    echo ""
    echo "🔧 To install Android Studio:"
    echo "   sudo snap install android-studio --classic"
    echo "   # OR download from: https://developer.android.com/studio"
    echo ""
fi

# Check for ANDROID_HOME environment variable
echo "📋 Checking ANDROID_HOME environment variable..."
if [ -n "$ANDROID_HOME" ]; then
    echo "✅ ANDROID_HOME is set to: $ANDROID_HOME"
else
    echo "❌ ANDROID_HOME is not set"
    echo ""
    echo "🔧 To fix this, add to your ~/.bashrc:"
    echo "   export ANDROID_HOME=\$HOME/Android/Sdk"
    echo "   export PATH=\$PATH:\$ANDROID_HOME/platform-tools:\$ANDROID_HOME/emulator"
    echo ""
    echo "   Then run: source ~/.bashrc"
    echo ""
fi

# Check for platform-tools (adb)
echo "📋 Checking Android platform-tools..."
if command -v adb &> /dev/null; then
    echo "✅ ADB (Android Debug Bridge) is available"
    echo "   Version: $(adb version | head -1)"
else
    echo "❌ ADB not found in PATH"
    echo "   This will be fixed once Android SDK is properly installed and PATH is set"
    echo ""
fi

# Final recommendations
echo ""
echo "🎯 NEXT STEPS:"
echo "============="

# Check what needs to be done
NEEDS_JDK=false
NEEDS_ANDROID_STUDIO=false
NEEDS_ENV_VARS=false

if java -version 2>&1 | grep -q "openjdk version \"2[1-9]"; then
    NEEDS_JDK=true
fi

if [ ! -d "$HOME/Android/Sdk" ]; then
    NEEDS_ANDROID_STUDIO=true
fi

if [ -z "$ANDROID_HOME" ]; then
    NEEDS_ENV_VARS=true
fi

if [ "$NEEDS_JDK" = true ]; then
    echo "1. Install compatible Java JDK (17-20)"
    echo "   sudo apt install openjdk-17-jdk"
    echo ""
fi

if [ "$NEEDS_ANDROID_STUDIO" = true ]; then
    echo "2. Install Android Studio"
    echo "   sudo snap install android-studio --classic"
    echo "   # Then launch and install SDK components"
    echo ""
fi

if [ "$NEEDS_ENV_VARS" = true ]; then
    echo "3. Set environment variables in ~/.bashrc:"
    echo "   echo 'export ANDROID_HOME=\$HOME/Android/Sdk' >> ~/.bashrc"
    echo "   echo 'export PATH=\$PATH:\$ANDROID_HOME/platform-tools:\$ANDROID_HOME/emulator' >> ~/.bashrc"
    echo "   source ~/.bashrc"
    echo ""
fi

if [ "$NEEDS_JDK" = false ] && [ "$NEEDS_ANDROID_STUDIO" = false ] && [ "$NEEDS_ENV_VARS" = false ]; then
    echo "🎉 All requirements seem to be met!"
    echo ""
    echo "Try running your app:"
    echo "   npm run android"
    echo ""
else
    echo "4. After completing the above steps, run React Native doctor:"
    echo "   npx react-native doctor"
    echo ""
    echo "5. Then try building your Chinese Chess app:"
    echo "   npm run android"
    echo ""
fi

echo "📖 For detailed instructions, see: ANDROID_BUILD_FIX.md"
echo ""
echo "🎮 Once setup is complete, you'll be able to play Chinese Chess on Android!"