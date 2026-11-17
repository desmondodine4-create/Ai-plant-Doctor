import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../config/app_config.dart';
import '../models/diagnosis_model.dart';

class ApiException implements Exception {
  final String message;
  final int? statusCode;

  const ApiException(this.message, {this.statusCode});

  @override
  String toString() => message;
}

class ApiService {
  final String baseUrl;

  ApiService({String? customBaseUrl})
      : baseUrl = (customBaseUrl != null && customBaseUrl.trim().isNotEmpty)
            ? customBaseUrl.trim().replaceAll(RegExp(r'/$'), '')
            : AppConfig.defaultApiBaseUrl;

  Future<DiagnosisResult> diagnosePlantImage({
    required File imageFile,
    String? plantHint,
    String? notes,
  }) async {
    final bytes = await imageFile.readAsBytes();
    if (bytes.isEmpty) {
      throw const ApiException('The selected image file appears to be empty.');
    }
    final base64Image = base64Encode(bytes);
    final ext = imageFile.path.toLowerCase();
    final mimeType = ext.endsWith('.png')
        ? 'image/png'
        : ext.endsWith('.webp')
            ? 'image/webp'
            : 'image/jpeg';

    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/api/diagnose'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'imageBase64': base64Image,
              'mimeType': mimeType,
              'plantHint': plantHint ?? '',
              'notes': notes ?? '',
            }),
          )
          .timeout(const Duration(seconds: 45));

      final payload = _decodeJson(response.body);
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return DiagnosisResult.fromJson(
          payload,
          imagePath: imageFile.path,
        );
      }

      if (response.statusCode == 429) {
        throw const ApiException(
          'AI service rate limit reached. Please wait a moment and try again.',
          statusCode: 429,
        );
      }
      throw ApiException(
        payload['error']?.toString() ?? 'Failed to analyze plant image.',
        statusCode: response.statusCode,
      );
    } on SocketException {
      throw const ApiException(
        'No internet connection or server unreachable. Please check your connection and try again.',
      );
    } on TimeoutException {
      throw const ApiException(
        'The diagnosis request timed out. Please try again with a clearer or smaller image.',
      );
    } on FormatException {
      throw const ApiException('Received an unexpected response from the server.');
    }
  }

  Future<String> askCareAssistant({
    required String question,
    List<Map<String, String>> history = const [],
    String? cropContext,
  }) async {
    try {
      final response = await http
          .post(
            Uri.parse('$baseUrl/api/assistant'),
            headers: {'Content-Type': 'application/json'},
            body: jsonEncode({
              'question': question,
              'history': history,
              'cropContext': cropContext ?? '',
            }),
          )
          .timeout(const Duration(seconds: 35));

      final payload = _decodeJson(response.body);
      if (response.statusCode >= 200 && response.statusCode < 300) {
        return payload['answer']?.toString() ?? 'No response generated.';
      }
      if (response.statusCode == 429) {
        throw const ApiException(
          'Too many requests right now. Please wait a few seconds and ask again.',
          statusCode: 429,
        );
      }
      throw ApiException(
        payload['error']?.toString() ?? 'Unable to reach Plant Care Assistant.',
        statusCode: response.statusCode,
      );
    } on SocketException {
      throw const ApiException(
        'Internet connection unavailable. Please reconnect to ask the AI Plant Care Assistant.',
      );
    } on TimeoutException {
      throw const ApiException('Assistant request timed out. Please try again.');
    }
  }

  Map<String, dynamic> _decodeJson(String body) {
    if (body.isEmpty) return {};
    final parsed = jsonDecode(body);
    return parsed is Map<String, dynamic> ? parsed : {};
  }
}
