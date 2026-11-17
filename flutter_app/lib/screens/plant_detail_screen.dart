import 'package:flutter/material.dart';
import '../models/plant_info.dart';
import '../models/user_profile.dart';
import 'care_assistant_screen.dart';

class PlantDetailScreen extends StatelessWidget {
  final PlantInfo plant;
  final UserProfile profile;

  const PlantDetailScreen({
    super.key,
    required this.plant,
    required this.profile,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF6FAF6),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF6FAF6),
        surfaceTintColor: Colors.transparent,
        title: Text(plant.name, style: const TextStyle(fontWeight: FontWeight.w700)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
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
                    plant.scientificName,
                    style: const TextStyle(
                      fontStyle: FontStyle.italic,
                      fontSize: 14,
                      color: Color(0xFF16A34A),
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    plant.name,
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF0F2417),
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    plant.overview,
                    style: const TextStyle(fontSize: 14, height: 1.5, color: Color(0xFF284132)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 14),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFFDCE8DE)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Growing Requirements',
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 16,
                      color: Color(0xFF0F2417),
                    ),
                  ),
                  const SizedBox(height: 10),
                  _ReqRow('Sunlight', plant.sunlight),
                  _ReqRow('Water', plant.water),
                  _ReqRow('Soil pH', plant.soilPh),
                  _ReqRow('Temperature', plant.temperature),
                  _ReqRow('Spacing', plant.spacing),
                  _ReqRow('Harvest Window', plant.harvestWindow),
                ],
              ),
            ),
            const SizedBox(height: 14),
            const Text(
              'Common Diseases & Symptoms',
              style: TextStyle(
                fontWeight: FontWeight.w700,
                fontSize: 16,
                color: Color(0xFF0F2417),
              ),
            ),
            const SizedBox(height: 8),
            ...plant.commonDiseases.map(
              (d) => Container(
                margin: const EdgeInsets.only(bottom: 10),
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
                      d.name,
                      style: const TextStyle(
                        fontWeight: FontWeight.w700,
                        fontSize: 15,
                        color: Color(0xFF14532D),
                      ),
                    ),
                    Text(
                      d.pathogenType,
                      style: const TextStyle(fontSize: 12, color: Color(0xFF4B6353)),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Symptoms: ${d.symptoms}',
                      style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFF284132)),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Prevention: ${d.prevention}',
                      style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFF284132)),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 8),
            Container(
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
                    'Field Prevention Checklist',
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 15,
                      color: Color(0xFF14532D),
                    ),
                  ),
                  const SizedBox(height: 8),
                  ...plant.preventionAdvice.map(
                    (tip) => Padding(
                      padding: const EdgeInsets.only(bottom: 6),
                      child: Text(
                        '• $tip',
                        style: const TextStyle(fontSize: 13, height: 1.4, color: Color(0xFF14532D)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            FilledButton.icon(
              onPressed: () => Navigator.of(context).push(
                MaterialPageRoute(
                  builder: (_) => CareAssistantScreen(
                    profile: profile,
                    initialCropContext: plant.name,
                  ),
                ),
              ),
              style: FilledButton.styleFrom(
                backgroundColor: const Color(0xFF14532D),
                padding: const EdgeInsets.symmetric(vertical: 15),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              icon: const Icon(Icons.support_agent_rounded),
              label: Text('Ask Assistant About ${plant.name}'),
            ),
          ],
        ),
      ),
    );
  }
}

class _ReqRow extends StatelessWidget {
  final String label;
  final String value;

  const _ReqRow(this.label, this.value);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 115,
            child: Text(
              label,
              style: const TextStyle(
                fontWeight: FontWeight.w600,
                fontSize: 13,
                color: Color(0xFF4B6353),
              ),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: const TextStyle(fontSize: 13, color: Color(0xFF0F2417)),
            ),
          ),
        ],
      ),
    );
  }
}
