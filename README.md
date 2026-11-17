# AI Plant Doctor

**Tagline:** Your Intelligent Plant Health Assistant.

AI Plant Doctor is a full-stack agricultural health platform powered by Google's Gemini API (`gemini-4-hydrogen`). It combines:

1. **Android Studio Flutter Application (`/flutter_app/`)** — Complete Dart & Flutter project with Camera/Gallery image capture, Gemini-powered plant disease diagnosis, structured diagnosis reports, AI Plant Care Assistant, searchable Plant Library, persistent local history, and Profile/Settings.
2. **Secure Server-Side Gemini Backend (`/server.ts`)** — Express + `@google/genai` API server keeping `GEMINI_API_KEY` strictly in server environment secrets (`process.env.GEMINI_API_KEY`), never inside the Android APK or client bundle.
3. **Installable Android PWA & Web App (`/src/`)** — Live full-stack mobile-first Progressive Web App running on port `3000`, usable directly on Android smartphones or desktop browsers right now.

---

## Important Note About `AIPlantDoctor.apk` Compilation

The cloud Node.js build container hosting this workspace includes Node.js 22 and Python 3, **but does not have the Flutter SDK, Android SDK, Java JDK, or Gradle toolchain installed**. Because of that, a compiled `AIPlantDoctor.apk` binary cannot be generated inside this container.

All source code—complete Flutter Android Studio project (`/flutter_app/`), Express Gemini backend (`/server.ts`), and downloadable archive (`AIPlantDoctor_Source.zip`)—is complete and ready to compile into a release APK on any machine with Flutter + Android Studio installed using the steps below.

---

## 1. Running the Secure Backend Server

### Prerequisites
- Node.js 20+
- A valid `GEMINI_API_KEY` set in environment variables (or `.env`)

### Commands
```bash
npm install
export GEMINI_API_KEY="your_gemini_api_key_here"
npm run dev
```

For production:
```bash
npm run build
npm start
```

### API Endpoints
- `GET /api/health` — Backend readiness & key status check
- `POST /api/diagnose` — Multimodal plant image analysis (`{ imageBase64, mimeType, plantHint, notes }`)
- `POST /api/assistant` — Multi-turn agronomy Q&A (`{ question, history, cropContext }`)
- `GET /api/download/source-zip` — Downloads `AIPlantDoctor_Source.zip`

---

## 2. Building `AIPlantDoctor.apk` (Android Release Build)

### Prerequisites
- Flutter SDK (`>= 3.22`)
- Android Studio with Android SDK Platform 34 & Build-Tools
- Java JDK 17

### Steps
1. Download or extract `AIPlantDoctor_Source.zip` and open the `flutter_app/` folder in **Android Studio** or a terminal.
2. Fetch Flutter packages and generate launcher icons:
   ```bash
   cd flutter_app
   flutter pub get
   dart run flutter_launcher_icons
   ```
3. Build the release APK pointing to your deployed backend URL (default is preconfigured, or pass `--dart-define`):
   ```bash
   flutter build apk --release --dart-define=API_BASE_URL=https://ais-pre-oivaenuekrn2ubfchhemzv-49352884450.europe-west3.run.app
   ```
4. Locate your installable APK at:
   ```text
   flutter_app/build/app/outputs/flutter-apk/app-release.apk
   ```
   Rename/copy to `AIPlantDoctor.apk` and transfer to your Android phone to install.

---

## 3. Security Architecture

- **Zero Embedded Secrets:** `GEMINI_API_KEY` is read exclusively by `server.ts` from `process.env.GEMINI_API_KEY`.
- **Android Permissions (`AndroidManifest.xml`):**
  - `INTERNET` & `ACCESS_NETWORK_STATE`
  - `CAMERA`
  - `READ_MEDIA_IMAGES` / `READ_EXTERNAL_STORAGE` (maxSdkVersion 32)
- **Local Persistence:** Diagnosis reports, captured leaf photos, and grower preferences persist locally via `SharedPreferences` and `path_provider` in Flutter (and `localStorage` in the web/PWA app).
