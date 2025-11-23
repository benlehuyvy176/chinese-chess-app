#!/bin/bash

# 🎯 Project-Specific Java Environment Setup for Chinese Chess
# This script sets Java 17 for this React Native project only
# without affecting system-wide Java configuration

echo "🔧 Setting up project-specific Java 17 environment..."
echo "=================================================="

# Find Java 17 installation path
JAVA17_PATH=""
if [ -d "/usr/lib/jvm/java-17-openjdk-amd64" ]; then
    JAVA17_PATH="/usr/lib/jvm/java-17-openjdk-amd64"
elif [ -d "/usr/lib/jvm/java-17-openjdk" ]; then
    JAVA17_PATH="/usr/lib/jvm/java-17-openjdk"
else
    echo "❌ Java 17 not found. Installing..."
    sudo apt install openjdk-17-jdk
    JAVA17_PATH="/usr/lib/jvm/java-17-openjdk-amd64"
fi

echo "📍 Found Java 17 at: $JAVA17_PATH"

# Verify Java 17 exists
if [ ! -d "$JAVA17_PATH" ]; then
    echo "❌ Could not locate Java 17 installation"
    exit 1
fi

# Create project-specific environment file
cat > .env.local << EOF
# Project-specific Java configuration for Chinese Chess React Native app
# This overrides system Java settings only for this project

# Java 17 for React Native compatibility
export JAVA_HOME="$JAVA17_PATH"
export PATH="$JAVA17_PATH/bin:\$PATH"

# Android SDK configuration (update path after installing Android Studio)
export ANDROID_HOME="\$HOME/Android/Sdk"
export ANDROID_SDK_ROOT="\$ANDROID_HOME"

# Android tools in PATH
export PATH="\$PATH:\$ANDROID_HOME/emulator"
export PATH="\$PATH:\$ANDROID_HOME/platform-tools"
export PATH="\$PATH:\$ANDROID_HOME/cmdline-tools/latest/bin"
export PATH="\$PATH:\$ANDROID_HOME/build-tools/34.0.0"

EOF

# Create wrapper scripts for npm commands
cat > npm-android.sh << 'EOF'
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
EOF

# Make scripts executable
chmod +x npm-android.sh

# Update gradle wrapper to use project Java
if [ -f "android/gradle.properties" ]; then
    # Add or update JAVA_HOME in gradle.properties
    if grep -q "org.gradle.java.home" android/gradle.properties; then
        sed -i "s|org.gradle.java.home=.*|org.gradle.java.home=$JAVA17_PATH|" android/gradle.properties
    else
        echo "" >> android/gradle.properties
        echo "# Project-specific Java 17 for React Native compatibility" >> android/gradle.properties
        echo "org.gradle.java.home=$JAVA17_PATH" >> android/gradle.properties
    fi
    echo "✅ Updated android/gradle.properties with Java 17"
fi

# Update local.properties with current user
USERNAME=$(whoami)
cat > android/local.properties << EOF
# Android SDK location for user: $USERNAME
# Update this path after installing Android Studio

sdk.dir=/home/$USERNAME/Android/Sdk

# Alternative paths (uncomment if needed):
# sdk.dir=/home/$USERNAME/Library/Android/sdk  # macOS
# sdk.dir=C:\\Users\\$USERNAME\\AppData\\Local\\Android\\Sdk  # Windows
EOF

echo ""
echo "✅ Project-specific Java 17 environment created!"
echo ""
echo "📋 What was set up:"
echo "   • .env.local - Project environment variables"
echo "   • npm-android.sh - Wrapper script for Android builds"
echo "   • android/gradle.properties - Java 17 configuration"
echo "   • android/local.properties - Updated for current user"
echo ""
echo "🎯 HOW TO USE:"
echo "============="
echo ""
echo "Instead of 'npm run android', use:"
echo "   ./npm-android.sh android"
echo ""
echo "Instead of 'npx react-native doctor', use:"
echo "   ./npm-android.sh doctor"
echo ""
echo "🔍 To verify Java 17 is being used:"
echo "   source .env.local && java -version"
echo ""
echo "📱 Your system Java remains unchanged!"
echo "   System Java: $(java -version 2>&1 | head -1)"
echo "   Project Java: $JAVA17_PATH"
echo ""