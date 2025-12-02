# 📱 LudoMax APK Build Guide

## Build Android APK using Capacitor

### Prerequisites:
- Node.js installed
- Android Studio installed
- Java JDK 11+ installed

### Step 1: Install Capacitor

```bash
cd frontend
npm install @capacitor/core @capacitor/cli @capacitor/android
```

### Step 2: Initialize Capacitor

```bash
npx cap init LudoMax com.ludomax.app
```

### Step 3: Build React App

```bash
npm run build
```

### Step 4: Add Android Platform

```bash
npx cap add android
```

### Step 5: Copy Web Assets

```bash
npx cap copy android
npx cap sync android
```

### Step 6: Open in Android Studio

```bash
npx cap open android
```

### Step 7: Build APK in Android Studio

1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
2. Wait for build to complete
3. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

### Step 8: Install APK

```bash
# Transfer APK to phone and install
# Or use ADB:
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🚀 Quick Build Script

Create `build-apk.sh`:

```bash
#!/bin/bash
cd frontend
npm run build
npx cap copy android
npx cap sync android
cd android
./gradlew assembleDebug
echo "APK built at: android/app/build/outputs/apk/debug/app-debug.apk"
```

Run: `chmod +x build-apk.sh && ./build-apk.sh`

---

## 📦 Release APK (Production)

For Play Store release:

```bash
cd frontend/android
./gradlew assembleRelease
```

Sign APK:
```bash
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore my-release-key.keystore \
  app/build/outputs/apk/release/app-release-unsigned.apk \
  alias_name
```

---

## ⚡ Alternative: Use EAS Build (Expo)

```bash
npm install -g eas-cli
eas build --platform android
```

Download APK from Expo dashboard.

---

## 🎯 Fastest Method: Online APK Builder

1. Deploy app on Vercel
2. Use: https://www.pwabuilder.com
3. Enter your URL
4. Download APK

**No coding required!**
