import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import '../models/diagnosis_model.dart';
import '../models/user_profile.dart';
import '../services/api_service.dart';
import 'diagnosis_result_screen.dart';

class DiagnoseScreen extends StatefulWidget {
  final UserProfile profile;
  final Future<void> Function(DiagnosisResult) onSaveDiagnosis;
  final ImageSource? initialSourceTrigger;
  final VoidCallback onConsumedTrigger;

  const DiagnoseScreen({
    super.key,
    required this.profile,
    required this.onSaveDiagnosis,
    this.initialSourceTrigger,
    required this.onConsumedTrigger,
  });

  @override
  State<DiagnoseScreen> createState() => _DiagnoseScreenState();
}

class _DiagnoseScreenState extends State<DiagnoseScreen> {
  final ImagePicker _picker = ImagePicker();
  final TextEditingController _plantHintController = TextEditingController();
  final TextEditingController _notesController = TextEditingController();

  File? _selectedImage;
  bool _isAnalyzing = false;
  String? _errorMessage;
  String? _uncertaintyMessage;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (widget.initialSourceTrigger != null) {
        final source = widget.initialSourceTrigger!;
        widget.onConsumedTrigger();
        _pickImage(source);
      }
    });
  }

  @override
  void didUpdateWidget(covariant DiagnoseScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.initialSourceTrigger != null &&
        widget.initialSourceTrigger != oldWidget.initialSourceTrigger) {
      final source = widget.initialSourceTrigger!;
      WidgetsBinding.instance.addPostFrameCallback((_) {
        widget.onConsumedTrigger();
        _pickImage(source);
      });
    }
  }

  @override
  void dispose() {
    _plantHintController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final picked = await _picker.pickImage(
        source: source,
        maxWidth: 1600,
        maxHeight: 1600,
        imageQuality: 85,
      );
      if (picked == null) return;
      setState(() {
        _selectedImage = File(picked.path);
        _errorMessage = null;
        _uncertaintyMessage = null;
      });
    } catch (e) {
      setState(() {
        _errorMessage = 'Could not access ${source == ImageSource.camera ? "camera" : "gallery"}: $e';
      });
    }
  }

  Future<void> _analyzeImage() async {
    if (_selectedImage == null) return;

    setState(() {
      _isAnalyzing = true;
      _errorMessage = null;
      _uncertaintyMessage = null;
    });

    try {
      final api = ApiService(customBaseUrl: widget.profile.customServerUrl);
      final result = await api.diagnosePlantImage(
        imageFile: _selectedImage!,
        plantHint: _plantHintController.text.trim(),
        notes: _notesController.text.trim(),
      );

      if (!mounted) return;

      if (result.isUncertain || !result.isPlantImage) {
        setState(() {
          _uncertaintyMessage = result.uncertaintyReason.isNotEmpty
              ? result.uncertaintyReason
              : 'The photograph is unclear or does not clearly show plant foliage. Please retake a well-lit close-up photo.';
        });
        return;
      }

      if (widget.profile.autoSaveHistory) {
        await widget.onSaveDiagnosis(result);
      }

      if (!mounted) return;
      await Navigator.of(context).push(
        MaterialPageRoute(
          builder: (_) => DiagnosisResultScreen(
            result: result,
            isSaved: widget.profile.autoSaveHistory,
            onSave: widget.onSaveDiagnosis,
          ),
        ),
      );
    } on ApiException catch (e) {
      setState(() => _errorMessage = e.message);
    } catch (e) {
      setState(() => _errorMessage = 'Unexpected error during analysis: $e');
    } finally {
      if (mounted) {
        setState(() => _isAnalyzing = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6FAF6),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF6FAF6),
        surfaceTintColor: Colors.transparent,
        title: const Text(
          'AI Plant Diagnosis',
          style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF0F2417)),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Container(
              height: 260,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(22),
                border: Border.all(color: const Color(0xFFDCE8DE)),
              ),
              child: _selectedImage == null
                  ? Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          width: 64,
                          height: 64,
                          decoration: BoxDecoration(
                            color: const Color(0xFFDCFCE7),
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Icon(
                            Icons.center_focus_strong_rounded,
                            size: 32,
                            color: Color(0xFF14532D),
                          ),
                        ),
                        const SizedBox(height: 14),
                        const Text(
                          'Capture or Upload a Plant Photo',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF0F2417),
                          ),
                        ),
                        const SizedBox(height: 6),
                        const Padding(
                          padding: EdgeInsets.symmetric(horizontal: 28),
                          child: Text(
                            'Focus closely on symptomatic leaves, stems, or fruit in bright natural light.',
                            textAlign: TextAlign.center,
                            style: TextStyle(fontSize: 13, color: Color(0xFF4B6353)),
                          ),
                        ),
                      ],
                    )
                  : Stack(
                      fit: StackFit.expand,
                      children: [
                        ClipRRect(
                          borderRadius: BorderRadius.circular(21),
                          child: Image.file(_selectedImage!, fit: BoxFit.cover),
                        ),
                        Positioned(
                          top: 10,
                          right: 10,
                          child: IconButton.filled(
                            style: IconButton.styleFrom(
                              backgroundColor: Colors.black54,
                              foregroundColor: Colors.white,
                            ),
                            onPressed: _isAnalyzing
                                ? null
                                : () => setState(() {
                                      _selectedImage = null;
                                      _errorMessage = null;
                                      _uncertaintyMessage = null;
                                    }),
                            icon: const Icon(Icons.close_rounded),
                          ),
                        ),
                      ],
                    ),
            ),
            const SizedBox(height: 14),
            Row(
              children: [
                Expanded(
                  child: FilledButton.icon(
                    onPressed: _isAnalyzing ? null : () => _pickImage(ImageSource.camera),
                    style: FilledButton.styleFrom(
                      backgroundColor: const Color(0xFF14532D),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    icon: const Icon(Icons.camera_alt_rounded),
                    label: const Text('Take Photo'),
                  ),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _isAnalyzing ? null : () => _pickImage(ImageSource.gallery),
                    style: OutlinedButton.styleFrom(
                      foregroundColor: const Color(0xFF14532D),
                      side: const BorderSide(color: Color(0xFF14532D)),
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    icon: const Icon(Icons.photo_library_outlined),
                    label: const Text('Gallery'),
                  ),
                ),
              ],
            ),
            if (_uncertaintyMessage != null) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFFBEB),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFFDE68A)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.help_outline_rounded, color: Color(0xFFB45309)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Clearer Photograph Needed',
                            style: TextStyle(
                              fontWeight: FontWeight.w700,
                              color: Color(0xFF92400E),
                            ),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            _uncertaintyMessage!,
                            style: const TextStyle(fontSize: 13, color: Color(0xFF78350F)),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ],
            if (_errorMessage != null) ...[
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: const Color(0xFFFEF2F2),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFFECACA)),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.error_outline_rounded, color: Color(0xFFB91C1C)),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text(
                        _errorMessage!,
                        style: const TextStyle(fontSize: 13, color: Color(0xFF991B1B)),
                      ),
                    ),
                  ],
                ),
              ),
            ],
            const SizedBox(height: 18),
            TextField(
              controller: _plantHintController,
              decoration: InputDecoration(
                labelText: 'Crop or Plant Name (Optional)',
                hintText: 'e.g., Tomato, Cassava, Maize',
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFFDCE8DE)),
                ),
              ),
            ),
            const SizedBox(height: 12),
            TextField(
              controller: _notesController,
              maxLines: 2,
              decoration: InputDecoration(
                labelText: 'Observed Field Notes (Optional)',
                hintText: 'e.g., Lower leaves yellowing after 3 days of rain',
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFFDCE8DE)),
                ),
              ),
            ),
            const SizedBox(height: 20),
            FilledButton(
              onPressed: (_selectedImage != null && !_isAnalyzing) ? _analyzeImage : null,
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF16A34A),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: _isAnalyzing
                  ? const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(strokeWidth: 2.5, color: Colors.white),
                        ),
                        SizedBox(width: 12),
                        Text('Analyzing Plant with Gemini AI...'),
                      ],
                    )
                  : const Text(
                      'Submit for AI Diagnosis',
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.w700),
                    ),
            ),
          ],
        ),
      ),
    );
  }
}
