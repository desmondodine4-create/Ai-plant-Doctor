import 'dart:io';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:share_plus/share_plus.dart';
import '../models/diagnosis_model.dart';

class DiagnosisResultScreen extends StatefulWidget {
  final DiagnosisResult result;
  final bool isSaved;
  final Future<void> Function(DiagnosisResult) onSave;

  const DiagnosisResultScreen({
    super.key,
    required this.result,
    required this.isSaved,
    required this.onSave,
  });

  @override
  State<DiagnosisResultScreen> createState() => _DiagnosisResultScreenState();
}

class _DiagnosisResultScreenState extends State<DiagnosisResultScreen> {
  late bool _saved = widget.isSaved;

  Color _severityColor() {
    if (widget.result.isHealthy) return const Color(0xFF15803D);
    switch (widget.result.severity.toLowerCase()) {
      case 'mild':
        return const Color(0xFFB45309);
      case 'moderate':
        return const Color(0xFFC2410C);
      case 'severe':
      case 'critical':
        return const Color(0xFFB91C1C);
      default:
        return const Color(0xFF14532D);
    }
  }

  Future<void> _handleSave() async {
    await widget.onSave(widget.result);
    if (!mounted) return;
    setState(() => _saved = true);
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Diagnosis saved to local history.')),
    );
  }

  Future<void> _handleShare() async {
    await Share.share(widget.result.toShareableText());
  }

  @override
  Widget build(BuildContext context) {
    final r = widget.result;
    final statusColor = _severityColor();

    return Scaffold(
      backgroundColor: const Color(0xFFF6FAF6),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF6FAF6),
        surfaceTintColor: Colors.transparent,
        title: const Text('Diagnosis Report', style: TextStyle(fontWeight: FontWeight.w700)),
        actions: [
          IconButton(
            onPressed: _handleShare,
            icon: const Icon(Icons.share_rounded),
            tooltip: 'Share Report',
          ),
          IconButton(
            onPressed: _saved ? null : _handleSave,
            icon: Icon(_saved ? Icons.bookmark_added_rounded : Icons.bookmark_add_outlined),
            tooltip: _saved ? 'Saved' : 'Save Report',
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 36),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (r.imagePath != null && File(r.imagePath!).existsSync())
              ClipRRect(
                borderRadius: BorderRadius.circular(22),
                child: Image.file(
                  File(r.imagePath!),
                  height: 220,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
            const SizedBox(height: 16),
            Container(
              padding: const EdgeInsets.all(18),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFDCE8DE)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    '${r.plantName}${r.scientificName.isNotEmpty ? " (${r.scientificName})" : ""}',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF4B6353),
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    r.isHealthy ? 'Healthy Plant Foliage' : r.diseaseName,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF0F2417),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Severity: ${r.severity}  ·  Confidence: ${r.confidenceLevel} (${r.confidenceScore}%)  ·  ${DateFormat.yMMMd().format(r.createdAt)}',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: statusColor,
                    ),
                  ),
                  if (r.diseaseDescription.isNotEmpty) ...[
                    const SizedBox(height: 12),
                    Text(
                      r.diseaseDescription,
                      style: const TextStyle(fontSize: 14, height: 1.5, color: Color(0xFF284132)),
                    ),
                  ],
                ],
              ),
            ),
            if (r.symptomsDetected.isNotEmpty)
              _ReportListSection(title: 'Symptoms Detected', items: r.symptomsDetected),
            if (r.possibleCauses.isNotEmpty)
              _ReportListSection(title: 'Possible Causes', items: r.possibleCauses),
            if (r.recommendedTreatment.isNotEmpty)
              Container(
                margin: const EdgeInsets.only(top: 14),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Recommended Treatment Overview',
                      style: TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                        color: Color(0xFF14532D),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      r.recommendedTreatment,
                      style: const TextStyle(fontSize: 14, height: 1.45, color: Color(0xFF14532D)),
                    ),
                  ],
                ),
              ),
            if (r.stepByStepTreatment.isNotEmpty)
              _ReportListSection(
                title: 'Step-by-Step Treatment Instructions',
                items: r.stepByStepTreatment,
                numbered: true,
              ),
            if (r.preventionTips.isNotEmpty)
              _ReportListSection(title: 'Prevention Tips', items: r.preventionTips),
            if (r.followUpCare.isNotEmpty)
              _ReportListSection(title: 'Follow-Up Care Recommendations', items: r.followUpCare),
          ],
        ),
      ),
    );
  }
}

class _ReportListSection extends StatelessWidget {
  final String title;
  final List<String> items;
  final bool numbered;

  const _ReportListSection({
    required this.title,
    required this.items,
    this.numbered = false,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(top: 14),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFDCE8DE)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              fontWeight: FontWeight.w700,
              fontSize: 15,
              color: Color(0xFF0F2417),
            ),
          ),
          const SizedBox(height: 10),
          ...List.generate(items.length, (i) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 8),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    numbered ? '${i + 1}. ' : '• ',
                    style: const TextStyle(
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF16A34A),
                    ),
                  ),
                  Expanded(
                    child: Text(
                      items[i],
                      style: const TextStyle(fontSize: 14, height: 1.45, color: Color(0xFF284132)),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}
