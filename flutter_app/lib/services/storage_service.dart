import 'dart:convert';
import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/diagnosis_model.dart';
import '../models/user_profile.dart';

class StorageService {
  static const _historyKey = 'ai_plant_doctor_history_v1';
  static const _profileKey = 'ai_plant_doctor_profile_v1';

  Future<List<DiagnosisResult>> loadHistory() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_historyKey);
    if (raw == null || raw.isEmpty) return [];
    try {
      return DiagnosisResult.decodeList(raw);
    } catch (_) {
      return [];
    }
  }

  Future<DiagnosisResult> saveDiagnosis(DiagnosisResult diagnosis) async {
    String? persistedPath = diagnosis.imagePath;
    if (persistedPath != null && persistedPath.isNotEmpty) {
      final source = File(persistedPath);
      if (await source.exists()) {
        final appDir = await getApplicationDocumentsDirectory();
        final imagesDir = Directory('${appDir.path}/plant_scans');
        if (!await imagesDir.exists()) {
          await imagesDir.create(recursive: true);
        }
        final targetPath = '${imagesDir.path}/${diagnosis.id}.jpg';
        if (source.path != targetPath) {
          await source.copy(targetPath);
        }
        persistedPath = targetPath;
      }
    }

    final saved = DiagnosisResult(
      id: diagnosis.id,
      createdAt: diagnosis.createdAt,
      imagePath: persistedPath,
      isPlantImage: diagnosis.isPlantImage,
      isUncertain: diagnosis.isUncertain,
      uncertaintyReason: diagnosis.uncertaintyReason,
      plantName: diagnosis.plantName,
      scientificName: diagnosis.scientificName,
      isHealthy: diagnosis.isHealthy,
      diseaseName: diagnosis.diseaseName,
      confidenceLevel: diagnosis.confidenceLevel,
      confidenceScore: diagnosis.confidenceScore,
      severity: diagnosis.severity,
      diseaseDescription: diagnosis.diseaseDescription,
      symptomsDetected: diagnosis.symptomsDetected,
      possibleCauses: diagnosis.possibleCauses,
      recommendedTreatment: diagnosis.recommendedTreatment,
      stepByStepTreatment: diagnosis.stepByStepTreatment,
      preventionTips: diagnosis.preventionTips,
      followUpCare: diagnosis.followUpCare,
    );

    final list = await loadHistory();
    final updated = [saved, ...list.where((item) => item.id != saved.id)];
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_historyKey, DiagnosisResult.encodeList(updated));
    return saved;
  }

  Future<void> deleteDiagnosis(String id) async {
    final list = await loadHistory();
    final target = list.where((e) => e.id == id).toList();
    for (final item in target) {
      if (item.imagePath != null) {
        final f = File(item.imagePath!);
        if (await f.exists()) {
          await f.delete();
        }
      }
    }
    final remaining = list.where((e) => e.id != id).toList();
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_historyKey, DiagnosisResult.encodeList(remaining));
  }

  Future<UserProfile> loadProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_profileKey);
    if (raw == null || raw.isEmpty) return const UserProfile();
    try {
      return UserProfile.fromJson(jsonDecode(raw) as Map<String, dynamic>);
    } catch (_) {
      return const UserProfile();
    }
  }

  Future<void> saveProfile(UserProfile profile) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_profileKey, jsonEncode(profile.toJson()));
  }
}
