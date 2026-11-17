import 'dart:io';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import '../models/diagnosis_model.dart';
import '../models/user_profile.dart';
import 'care_assistant_screen.dart';
import 'diagnosis_result_screen.dart';

class HomeScreen extends StatelessWidget {
  final UserProfile profile;
  final List<DiagnosisResult> recentHistory;
  final VoidCallback onScanTap;
  final VoidCallback onUploadTap;
  final VoidCallback onOpenLibrary;
  final VoidCallback onOpenHistory;
  final Future<void> Function(DiagnosisResult) onSaveDiagnosis;

  const HomeScreen({
    super.key,
    required this.profile,
    required this.recentHistory,
    required this.onScanTap,
    required this.onUploadTap,
    required this.onOpenLibrary,
    required this.onOpenHistory,
    required this.onSaveDiagnosis,
  });

  String _greeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    const tips = [
      (
        'Morning Watering Window',
        'Water crops before 9:00 AM so leaves dry in sunlight, reducing fungal spore germination.'
      ),
      (
        'Lower-Leaf Airflow',
        'Prune yellowing lower leaves touching damp soil on tomatoes and peppers to stop soil splash blight.'
      ),
      (
        'Clean Pruning Tools',
        'Wipe shears with diluted alcohol or bleach solution between sick and healthy plants.'
      ),
    ];

    return CustomScrollView(
      slivers: [
        SliverAppBar(
          floating: true,
          backgroundColor: const Color(0xFFF6FAF6),
          surfaceTintColor: Colors.transparent,
          title: Row(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: const Color(0xFF14532D),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.eco_rounded, color: Color(0xFF4ADE80), size: 20),
              ),
              const SizedBox(width: 10),
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'AI Plant Doctor',
                    style: TextStyle(
                      fontSize: 17,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF0F2417),
                    ),
                  ),
                  Text(
                    'Your Intelligent Plant Health Assistant',
                    style: TextStyle(fontSize: 11, color: Color(0xFF4B6353)),
                  ),
                ],
              ),
            ],
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.fromLTRB(16, 8, 16, 28),
          sliver: SliverList(
            delegate: SliverChildListDelegate([
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF14532D), Color(0xFF166534)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${_greeting()}, ${profile.name}',
                      style: const TextStyle(
                        color: Color(0xFFBBF7D0),
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Check Crop Health in Seconds',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                        height: 1.2,
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Capture a clear photo of any affected leaf or stem to receive Gemini-powered disease diagnosis and treatment steps.',
                      style: TextStyle(color: Color(0xFFDCFCE7), fontSize: 13, height: 1.45),
                    ),
                    const SizedBox(height: 18),
                    Row(
                      children: [
                        Expanded(
                          child: FilledButton.icon(
                            onPressed: onScanTap,
                            style: FilledButton.styleFrom(
                              backgroundColor: const Color(0xFF22C55E),
                              foregroundColor: const Color(0xFF052E16),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                            ),
                            icon: const Icon(Icons.photo_camera_rounded),
                            label: const Text(
                              'Scan a Plant',
                              style: TextStyle(fontWeight: FontWeight.w700),
                            ),
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: OutlinedButton.icon(
                            onPressed: onUploadTap,
                            style: OutlinedButton.styleFrom(
                              foregroundColor: Colors.white,
                              side: const BorderSide(color: Color(0xFF86EFAC)),
                              padding: const EdgeInsets.symmetric(vertical: 14),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(14),
                              ),
                            ),
                            icon: const Icon(Icons.photo_library_rounded),
                            label: const Text(
                              'Upload Image',
                              style: TextStyle(fontWeight: FontWeight.w600),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              Text(
                'Quick Access',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF0F2417),
                ),
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: _QuickActionCard(
                      icon: Icons.support_agent_rounded,
                      title: 'Care Assistant',
                      subtitle: 'Ask Gemini agronomy questions',
                      onTap: () => Navigator.of(context).push(
                        MaterialPageRoute(
                          builder: (_) => CareAssistantScreen(profile: profile),
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: _QuickActionCard(
                      icon: Icons.menu_book_rounded,
                      title: 'Plant Library',
                      subtitle: 'Crop guides & prevention',
                      onTap: onOpenLibrary,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    'Recent Diagnoses',
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF0F2417),
                    ),
                  ),
                  TextButton(
                    onPressed: onOpenHistory,
                    child: const Text('View All'),
                  ),
                ],
              ),
              if (recentHistory.isEmpty)
                Container(
                  padding: const EdgeInsets.all(18),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFFDCE8DE)),
                  ),
                  child: const Row(
                    children: [
                      Icon(Icons.spa_outlined, color: Color(0xFF16A34A), size: 28),
                      SizedBox(width: 12),
                      Expanded(
                        child: Text(
                          'No plant scans yet. Tap "Scan a Plant" above to run your first Gemini diagnosis.',
                          style: TextStyle(color: Color(0xFF4B6353), fontSize: 13),
                        ),
                      ),
                    ],
                  ),
                )
              else
                ...recentHistory.take(3).map(
                      (item) => Padding(
                        padding: const EdgeInsets.only(bottom: 10),
                        child: InkWell(
                          borderRadius: BorderRadius.circular(18),
                          onTap: () => Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => DiagnosisResultScreen(
                                result: item,
                                isSaved: true,
                                onSave: onSaveDiagnosis,
                              ),
                            ),
                          ),
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: Colors.white,
                              borderRadius: BorderRadius.circular(18),
                              border: Border.all(color: const Color(0xFFDCE8DE)),
                            ),
                            child: Row(
                              children: [
                                ClipRRect(
                                  borderRadius: BorderRadius.circular(12),
                                  child: item.imagePath != null &&
                                          File(item.imagePath!).existsSync()
                                      ? Image.file(
                                          File(item.imagePath!),
                                          width: 56,
                                          height: 56,
                                          fit: BoxFit.cover,
                                        )
                                      : Container(
                                          width: 56,
                                          height: 56,
                                          color: const Color(0xFFECFDF5),
                                          child: const Icon(
                                            Icons.local_florist_rounded,
                                            color: Color(0xFF16A34A),
                                          ),
                                        ),
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        item.plantName,
                                        style: const TextStyle(
                                          fontWeight: FontWeight.w700,
                                          fontSize: 15,
                                          color: Color(0xFF0F2417),
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        '${item.isHealthy ? "Healthy" : item.diseaseName} · ${DateFormat.yMMMd().format(item.createdAt)}',
                                        maxLines: 1,
                                        overflow: TextOverflow.ellipsis,
                                        style: const TextStyle(
                                          fontSize: 12,
                                          color: Color(0xFF4B6353),
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                const Icon(Icons.chevron_right_rounded,
                                    color: Color(0xFF6B8574)),
                              ],
                            ),
                          ),
                        ),
                      ),
                    ),
              const SizedBox(height: 20),
              Text(
                'Plant Health Tips',
                style: theme.textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF0F2417),
                ),
              ),
              const SizedBox(height: 10),
              ...tips.map(
                (tip) => Container(
                  margin: const EdgeInsets.only(bottom: 10),
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFDCE8DE)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        tip.$1,
                        style: const TextStyle(
                          fontWeight: FontWeight.w700,
                          fontSize: 14,
                          color: Color(0xFF14532D),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        tip.$2,
                        style: const TextStyle(
                          fontSize: 13,
                          height: 1.4,
                          color: Color(0xFF3E5646),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ]),
          ),
        ),
      ],
    );
  }
}

class _QuickActionCard extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _QuickActionCard({
    required this.icon,
    required this.title,
    required this.subtitle,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(18),
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: const Color(0xFFDCE8DE)),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: const Color(0xFFDCFCE7),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: const Color(0xFF14532D)),
            ),
            const SizedBox(height: 12),
            Text(
              title,
              style: const TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 14,
                color: Color(0xFF0F2417),
              ),
            ),
            const SizedBox(height: 3),
            Text(
              subtitle,
              style: const TextStyle(fontSize: 12, color: Color(0xFF4B6353)),
            ),
          ],
        ),
      ),
    );
  }
}
