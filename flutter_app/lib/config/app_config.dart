class AppConfig {
  static const String appName = 'AI Plant Doctor';
  static const String tagline = 'Your Intelligent Plant Health Assistant';

  // Server-side proxy endpoint URL. The Gemini API key is NEVER stored in the app.
  // Override at build time using:
  // flutter build apk --release --dart-define=API_BASE_URL=https://your-server-url
  static const String defaultApiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://ais-pre-oivaenuekrn2ubfchhemzv-49352884450.europe-west3.run.app',
  );
}
