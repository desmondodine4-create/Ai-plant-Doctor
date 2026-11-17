import 'dart:convert';

class DiagnosisResult {
  final String id;
  final DateTime createdAt;
  final String? imagePath;
  final bool isPlantImage;
  final bool isUncertain;
  final String uncertaintyReason;
  final String plantName;
  final String scientificName;
  final bool isHealthy;
  final String diseaseName;
  final String confidenceLevel;
  final int confidenceScore;
  final String severity;
  final String diseaseDescription;
  final List<String> symptomsDetected;
  final List<String> possibleCauses;
  final String recommendedTreatment;
  final List<String> stepByStepTreatment;
  final List<String> preventionTips;
  final List<String> followUpCare;

  const DiagnosisResult({
    required this.id,
    required this.createdAt,
    this.imagePath,
    required this.isPlantImage,
    required this.isUncertain,
    required this.uncertaintyReason,
    required this.plantName,
    required this.scientificName,
    required this.isHealthy,
    required this.diseaseName,
    required this.confidenceLevel,
    required this.confidenceScore,
    required this.severity,
    required this.diseaseDescription,
    required this.symptomsDetected,
    required this.possibleCauses,
    required this.recommendedTreatment,
    required this.stepByStepTreatment,
    required this.preventionTips,
    required this.followUpCare,
  });

  factory DiagnosisResult.fromJson(
    Map<String, dynamic> json, {
    String? id,
    DateTime? createdAt,
    String? imagePath,
  }) {
    List<String> parseList(dynamic value) {
      if (value is List) {
        return value.map((e) => e.toString()).where((e) => e.isNotEmpty).toList();
      }
      return [];
    }

    return DiagnosisResult(
      id: id ?? json['id']?.toString() ?? DateTime.now().millisecondsSinceEpoch.toString(),
      createdAt: createdAt ??
          (json['createdAt'] != null
              ? DateTime.tryParse(json['createdAt'].toString()) ?? DateTime.now()
              : DateTime.now()),
      imagePath: imagePath ?? json['imagePath']?.toString(),
      isPlantImage: json['isPlantImage'] == true,
      isUncertain: json['isUncertain'] == true,
      uncertaintyReason: json['uncertaintyReason']?.toString() ?? '',
      plantName: json['plantName']?.toString() ?? 'Unknown Plant',
      scientificName: json['scientificName']?.toString() ?? '',
      isHealthy: json['isHealthy'] == true,
      diseaseName: json['diseaseName']?.toString() ?? 'Unidentified Condition',
      confidenceLevel: json['confidenceLevel']?.toString() ?? 'Medium',
      confidenceScore: (json['confidenceScore'] is num)
          ? (json['confidenceScore'] as num).round().clamp(0, 100)
          : 0,
      severity: json['severity']?.toString() ?? 'None',
      diseaseDescription: json['diseaseDescription']?.toString() ?? '',
      symptomsDetected: parseList(json['symptomsDetected']),
      possibleCauses: parseList(json['possibleCauses']),
      recommendedTreatment: json['recommendedTreatment']?.toString() ?? '',
      stepByStepTreatment: parseList(json['stepByStepTreatment']),
      preventionTips: parseList(json['preventionTips']),
      followUpCare: parseList(json['followUpCare']),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'createdAt': createdAt.toIso8601String(),
        'imagePath': imagePath,
        'isPlantImage': isPlantImage,
        'isUncertain': isUncertain,
        'uncertaintyReason': uncertaintyReason,
        'plantName': plantName,
        'scientificName': scientificName,
        'isHealthy': isHealthy,
        'diseaseName': diseaseName,
        'confidenceLevel': confidenceLevel,
        'confidenceScore': confidenceScore,
        'severity': severity,
        'diseaseDescription': diseaseDescription,
        'symptomsDetected': symptomsDetected,
        'possibleCauses': possibleCauses,
        'recommendedTreatment': recommendedTreatment,
        'stepByStepTreatment': stepByStepTreatment,
        'preventionTips': preventionTips,
        'followUpCare': followUpCare,
      };

  String toShareableText() {
    final buffer = StringBuffer()
      ..writeln('AI Plant Doctor — Diagnosis Report')
      ..writeln('Plant: $plantName${scientificName.isNotEmpty ? " ($scientificName)" : ""}')
      ..writeln('Condition: ${isHealthy ? "Healthy" : diseaseName}')
      ..writeln('Severity: $severity | Confidence: $confidenceLevel ($confidenceScore%)')
      ..writeln('')
      ..writeln('Summary: $diseaseDescription');
    if (symptomsDetected.isNotEmpty) {
      buffer.writeln('\nSymptoms:');
      for (final s in symptomsDetected) {
        buffer.writeln('- $s');
      }
    }
    if (stepByStepTreatment.isNotEmpty) {
      buffer.writeln('\nTreatment Steps:');
      for (var i = 0; i < stepByStepTreatment.length; i++) {
        buffer.writeln('${i + 1}. ${stepByStepTreatment[i]}');
      }
    }
    if (preventionTips.isNotEmpty) {
      buffer.writeln('\nPrevention:');
      for (final p in preventionTips) {
        buffer.writeln('- $p');
      }
    }
    return buffer.toString();
  }

  static String encodeList(List<DiagnosisResult> list) =>
      jsonEncode(list.map((e) => e.toJson()).toList());

  static List<DiagnosisResult> decodeList(String raw) {
    final decoded = jsonDecode(raw) as List<dynamic>;
    return decoded
        .map((e) => DiagnosisResult.fromJson(e as Map<String, dynamic>))
        .toList();
  }
}
