# 🔧 Android Build Error Fix Guide

## Current Issues Detected

Based on the React Native doctor output, here are the issues and their solutions:

### ❌ **Issues Found:**
1. **JDK Version**: Found v21.0.8, but React Native requires v17-20
2. **Android Studio**: Not installed
3. **ANDROID_HOME**: Environment variable not set
4. **Android SDK**: Not installed
5. **ADB**: Android Debug Bridge not available

---

## 🛠️ **Step-by-Step Fix Instructions**

### 1. **Fix Java JDK Version**

Your current JDK version (21.0.8) is too new. React Native requires JDK 17-20.

#### Install Compatible JDK:

**For Ubuntu/Debian:**
```bash
# Install OpenJDK 17
sudo apt update
sudo apt install openjdk-17-jdk

# Verify installation
java -version
# Should show: openjdk version "17.x.x"
```

**For Other Linux Distros:**
```bash
# Download from Oracle or use package manager
# Example for Fedora:
sudo dnf install java-17-openjdk-devel

# For Arch:
sudo pacman -S jdk17-openjdk
```

#### Set JAVA_HOME:
```bash
# Add to ~/.bashrc or ~/.zshrc
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
export PATH=$PATH:$JAVA_HOME/bin

# Reload shell configuration
source ~/.bashrc  # or ~/.zshrc
```

### 2. **Install Android Studio**

#### Download and Install:
```bash
# Download Android Studio
wget https://redirector.gvt1.com/edgedl/android/studio/ide-zips/2023.1.1.28/android-studio-2023.1.1.28-linux.tar.gz

# Extract
tar -xzf android-studio-*-linux.tar.gz

# Move to /opt (optional but recommended)
sudo mv android-studio /opt/

# Create desktop entry
/opt/android-studio/bin/studio.sh
```

#### Alternative - Use Package Manager:
```bash
# For Ubuntu/Debian (via Snap)
sudo snap install android-studio --classic

# For Fedora
sudo dnf install android-studio

# For Arch
yay -S android-studio
```

### 3. **Configure Android Studio**

#### First-time Setup:
1. **Launch Android Studio**
2. **Follow setup wizard**:
   - Choose "Standard" installation
   - Accept licenses
   - Download SDK components

#### Install Required SDK Components:
1. **Open Android Studio**
2. **Go to**: Tools → SDK Manager
3. **Install**:
   - ✅ Android SDK Platform 34 (or latest)
   - ✅ Android SDK Build-Tools 34.0.0
   - ✅ Android Emulator
   - ✅ Android SDK Platform-Tools

### 4. **Set Environment Variables**

#### Add to ~/.bashrc or ~/.zshrc:
```bash
# Android SDK Path (adjust if different)
export ANDROID_HOME=$HOME/Android/Sdk
export ANDROID_SDK_ROOT=$ANDROID_HOME

# Add Android tools to PATH
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
export PATH=$PATH:$ANDROID_HOME/build-tools/34.0.0

# Java (if not already set)
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
```

#### Apply changes:
```bash
# Reload configuration
source ~/.bashrc  # or source ~/.zshrc

# Verify variables
echo $ANDROID_HOME
echo $JAVA_HOME
```

### 5. **Update local.properties**

Update the file with your actual Android SDK path:

```bash
cd /home/ben/Documents/Personal_Stuff/Chess/ChineseChess
```

Edit `android/local.properties`:
```properties
# Replace with your actual Android SDK path
sdk.dir=/home/ben/Android/Sdk
```

### 6. **Create Android Emulator**

#### Via Android Studio:
1. **Open Android Studio**
2. **Tools → AVD Manager**
3. **Create Virtual Device**
4. **Choose device** (e.g., Pixel 7)
5. **Download system image** (API 34 recommended)
6. **Finish setup**

#### Via Command Line:
```bash
# List available system images
sdkmanager --list | grep system-images

# Install system image (example for API 34)
sdkmanager "system-images;android-34;google_apis;x86_64"

# Create AVD
avdmanager create avd -n "Pixel_7_API_34" -k "system-images;android-34;google_apis;x86_64"
```

### 7. **Test the Setup**

#### Verify Everything Works:
```bash
# Navigate to project
cd /home/ben/Documents/Personal_Stuff/Chess/ChineseChess

# Check React Native doctor
npx react-native doctor
# Should show all ✓ for Android section

# Start emulator
emulator -avd Pixel_7_API_34

# In another terminal, build and run
npm run android
```

---

## 🚀 **Quick Fix Commands**

If you want to try the automated approach:

```bash
# 1. Install compatible JDK
sudo apt install openjdk-17-jdk

# 2. Set environment variables
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator' >> ~/.bashrc
source ~/.bashrc

# 3. Install Android Studio (via Snap)
sudo snap install android-studio --classic

# 4. Update local.properties
echo "sdk.dir=$HOME/Android/Sdk" > /home/ben/Documents/Personal_Stuff/Chess/ChineseChess/android/local.properties

# 5. Launch Android Studio for SDK setup
android-studio
```

---

## ❗ **Common Issues & Solutions**

### Issue: "SDK location not found"
**Solution**: Make sure `android/local.properties` has the correct path:
```properties
sdk.dir=/home/ben/Android/Sdk
```

### Issue: "ANDROID_HOME not set"
**Solution**: Add to your shell profile:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
```

### Issue: "Unable to locate adb"
**Solution**: Add platform-tools to PATH:
```bash
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

### Issue: "No devices/emulators found"
**Solution**: Start an emulator:
```bash
emulator -avd YOUR_AVD_NAME
```

### Issue: Build fails with "Execution failed for task"
**Solution**: Clean and rebuild:
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

---

## 🎯 **After Setup - Test Your App**

Once everything is installed:

```bash
# 1. Navigate to project
cd /home/ben/Documents/Personal_Stuff/Chess/ChineseChess

# 2. Start Metro bundler
npm start

# 3. In another terminal, run Android
npm run android
```

Your Chinese Chess app should launch on the Android emulator! 🎉

---

## 📱 **Expected Result**

After following these steps, you should see:
- ✅ Android emulator running
- ✅ Chinese Chess app installed and launched
- ✅ Full game interface with traditional Chinese board
- ✅ Playable Chinese Chess with all Xiangqi rules

Need help with any specific step? Let me know!