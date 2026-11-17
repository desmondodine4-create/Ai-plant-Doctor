import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'config/app_config.dart';
import 'models/diagnosis_model.dart';
import 'models/user_profile.dart';
import 'screens/diagnose_screen.dart';
import 'screens/history_screen.dart';
import 'screens/home_screen.dart';
import 'screens/plant_library_screen.dart';
import 'screens/profile_screen.dart';
import 'services/storage_service.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const AiPlantDoctorApp());
}

class AiPlantDoctorApp extends StatelessWidget {
  const AiPlantDoctorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: AppConfig.appName,
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF14532D),
          primary: const Color(0xFF14532D),
          secondary: const Color(0xFF22C55E),
          surface: Colors.white,
        ),
        scaffoldBackgroundColor: const Color(0xFFF6FAF6),
      ),
      home: const MainShell(),
    );
  }
}

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  final StorageService _storage = StorageService();
  int _currentIndex = 0;
  ImageSource? _pendingPickerTrigger;
  List<DiagnosisResult> _history = [];
  UserProfile _profile = const UserProfile();
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    final loadedHistory = await _storage.loadHistory();
    final loadedProfile = await _storage.loadProfile();
    if (!mounted) return;
    setState(() {
      _history = loadedHistory;
      _profile = loadedProfile;
      _loading = false;
    });
  }

  Future<void> _saveDiagnosis(DiagnosisResult diagnosis) async {
    final saved = await _storage.saveDiagnosis(diagnosis);
    final refreshed = await _storage.loadHistory();
    if (!mounted) return;
    setState(() {
      _history = refreshed.isEmpty ? [saved] : refreshed;
    });
  }

  Future<void> _deleteDiagnosis(String id) async {
    await _storage.deleteDiagnosis(id);
    final refreshed = await _storage.loadHistory();
    if (!mounted) return;
    setState(() => _history = refreshed);
  }

  Future<void> _saveProfile(UserProfile next) async {
    await _storage.saveProfile(next);
    if (!mounted) return;
    setState(() => _profile = next);
  }

  void _openDiagnoseWithSource(ImageSource source) {
    setState(() {
      _pendingPickerTrigger = source;
      _currentIndex = 1;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Scaffold(
        backgroundColor: Color(0xFF14532D),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.eco_rounded, color: Color(0xFF4ADE80), size: 64),
              SizedBox(height: 16),
              Text(
                AppConfig.appName,
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  fontWeight: FontWeight.w700,
                ),
              ),
              SizedBox(height: 6),
              Text(
                AppConfig.tagline,
                style: TextStyle(color: Color(0xFFBBF7D0), fontSize: 13),
              ),
            ],
          ),
        ),
      );
    }

    final screens = [
      HomeScreen(
        profile: _profile,
        recentHistory: _history,
        onScanTap: () => _openDiagnoseWithSource(ImageSource.camera),
        onUploadTap: () => _openDiagnoseWithSource(ImageSource.gallery),
        onOpenLibrary: () => setState(() => _currentIndex = 2),
        onOpenHistory: () => setState(() => _currentIndex = 3),
        onSaveDiagnosis: _saveDiagnosis,
      ),
      DiagnoseScreen(
        profile: _profile,
        onSaveDiagnosis: _saveDiagnosis,
        initialSourceTrigger: _pendingPickerTrigger,
        onConsumedTrigger: () => setState(() => _pendingPickerTrigger = null),
      ),
      PlantLibraryScreen(profile: _profile),
      HistoryScreen(
        history: _history,
        onDelete: _deleteDiagnosis,
        onSaveDiagnosis: _saveDiagnosis,
      ),
      ProfileScreen(
        profile: _profile,
        onSaveProfile: _saveProfile,
      ),
    ];

    return Scaffold(
      body: IndexedStack(index: _currentIndex, children: screens),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        backgroundColor: Colors.white,
        indicatorColor: const Color(0xFFDCFCE7),
        onDestinationSelected: (i) => setState(() => _currentIndex = i),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home_rounded, color: Color(0xFF14532D)),
            label: 'Home',
          ),
          NavigationDestination(
            icon: Icon(Icons.document_scanner_outlined),
            selectedIcon: Icon(Icons.document_scanner_rounded, color: Color(0xFF14532D)),
            label: 'Diagnose',
          ),
          NavigationDestination(
            icon: Icon(Icons.menu_book_outlined),
            selectedIcon: Icon(Icons.menu_book_rounded, color: Color(0xFF14532D)),
            label: 'Library',
          ),
          NavigationDestination(
            icon: Icon(Icons.history_outlined),
            selectedIcon: Icon(Icons.history_rounded, color: Color(0xFF14532D)),
            label: 'History',
          ),
          NavigationDestination(
            icon: Icon(Icons.person_outline_rounded),
            selectedIcon: Icon(Icons.person_rounded, color: Color(0xFF14532D)),
            label: 'Profile',
          ),
        ],
      ),
    );
  }
}
