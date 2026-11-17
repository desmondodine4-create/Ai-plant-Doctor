import 'dart:io';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/diagnosis_model.dart';
import 'diagnosis_result_screen.dart';

class HistoryScreen extends StatelessWidget {
  final List<DiagnosisResult> history;
  final Future<void> Function(String id) onDelete;
  final Future<void> Function(DiagnosisResult) onSaveDiagnosis;

  const HistoryScreen({
    super.key,
    required this.history,
    required this.onDelete,
    required this.onSaveDiagnosis,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6FAF6),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF6FAF6),
        surfaceTintColor: Colors.transparent,
        title: const Text(
          'Diagnosis History',
          style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF0F2417)),
        ),
      ),
      body: history.isEmpty
          ? const Center(
              child: Padding(
                padding: EdgeInsets.all(32),
                child: Text(
                  'Your saved plant diagnosis reports and leaf scans will appear here for offline review.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 14, color: Color(0xFF4B6353)),
                ),
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.fromLTRB(16, 8, 16, 28),
              itemCount: history.length,
              itemBuilder: (_, index) {
                final item = history[index];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  color: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                    side: const BorderSide(color: Color(0xFFDCE8DE)),
                  ),
                  child: ListTile(
                    contentPadding: const EdgeInsets.all(12),
                    leading: ClipRRect(
                      borderRadius: BorderRadius.circular(12),
                      child: item.imagePath != null && File(item.imagePath!).existsSync()
                          ? Image.file(
                              File(item.imagePath!),
                              width: 58,
                              height: 58,
                              fit: BoxFit.cover,
                            )
                          : Container(
                              width: 58,
                              height: 58,
                              color: const Color(0xFFDCFCE7),
                              child: const Icon(Icons.eco_rounded, color: Color(0xFF14532D)),
                            ),
                    ),
                    title: Text(
                      item.plantName,
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        color: Color(0xFF0F2417),
                      ),
                    ),
                    subtitle: Text(
                      '${item.isHealthy ? "Healthy" : item.diseaseName}\n${DateFormat.yMMMd().add_jm().format(item.createdAt)}',
                      style: const TextStyle(fontSize: 12, color: Color(0xFF4B6353)),
                    ),
                    isThreeLine: true,
                    trailing: IconButton(
                      icon: const Icon(Icons.delete_outline_rounded, color: Color(0xFFB91C1C)),
                      tooltip: 'Delete record',
                      onPressed: () => onDelete(item.id),
                    ),
                    onTap: () => Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => DiagnosisResultScreen(
                          result: item,
                          isSaved: true,
                          onSave: onSaveDiagnosis,
                        ),
                      ),
                    ),
                  ),
                );
              },
            ),
    );
  }
}
