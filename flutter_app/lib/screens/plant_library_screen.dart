import 'package:flutter/material.dart';
import '../data/plant_library_data.dart';
import '../models/user_profile.dart';
import 'plant_detail_screen.dart';

class PlantLibraryScreen extends StatefulWidget {
  final UserProfile profile;

  const PlantLibraryScreen({super.key, required this.profile});

  @override
  State<PlantLibraryScreen> createState() => _PlantLibraryScreenState();
}

class _PlantLibraryScreenState extends State<PlantLibraryScreen> {
  String _query = '';
  String _selectedCategory = 'All';

  @override
  Widget build(BuildContext context) {
    final categories = ['All', ...{for (final p in kPlantLibrary) p.category}];
    final filtered = kPlantLibrary.where((plant) {
      final matchesCat = _selectedCategory == 'All' || plant.category == _selectedCategory;
      final q = _query.trim().toLowerCase();
      final matchesQuery = q.isEmpty ||
          plant.name.toLowerCase().contains(q) ||
          plant.scientificName.toLowerCase().contains(q) ||
          plant.commonDiseases.any((d) => d.name.toLowerCase().contains(q));
      return matchesCat && matchesQuery;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF6FAF6),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF6FAF6),
        surfaceTintColor: Colors.transparent,
        title: const Text(
          'Plant Library',
          style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF0F2417)),
        ),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 4, 16, 10),
            child: TextField(
              onChanged: (v) => setState(() => _query = v),
              decoration: InputDecoration(
                prefixIcon: const Icon(Icons.search_rounded),
                hintText: 'Search crops or diseases (e.g., Tomato, Cassava, Blight)...',
                filled: true,
                fillColor: Colors.white,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(14),
                  borderSide: const BorderSide(color: Color(0xFFDCE8DE)),
                ),
              ),
            ),
          ),
          SizedBox(
            height: 42,
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: categories.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (_, i) {
                final cat = categories[i];
                final selected = cat == _selectedCategory;
                return ChoiceChip(
                  label: Text(cat),
                  selected: selected,
                  selectedColor: const Color(0xFF14532D),
                  labelStyle: TextStyle(
                    color: selected ? Colors.white : const Color(0xFF0F2417),
                    fontWeight: FontWeight.w600,
                    fontSize: 12,
                  ),
                  onSelected: (_) => setState(() => _selectedCategory = cat),
                );
              },
            ),
          ),
          const SizedBox(height: 10),
          Expanded(
            child: filtered.isEmpty
                ? const Center(
                    child: Text(
                      'No matching crops found.',
                      style: TextStyle(color: Color(0xFF4B6353)),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.fromLTRB(16, 4, 16, 24),
                    itemCount: filtered.length,
                    itemBuilder: (_, i) {
                      final plant = filtered[i];
                      return Card(
                        margin: const EdgeInsets.only(bottom: 12),
                        color: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(18),
                          side: const BorderSide(color: Color(0xFFDCE8DE)),
                        ),
                        child: ListTile(
                          contentPadding: const EdgeInsets.all(14),
                          leading: Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(
                              color: const Color(0xFFDCFCE7),
                              borderRadius: BorderRadius.circular(14),
                            ),
                            child: const Icon(Icons.eco_rounded, color: Color(0xFF14532D)),
                          ),
                          title: Text(
                            plant.name,
                            style: const TextStyle(
                              fontWeight: FontWeight.w700,
                              fontSize: 16,
                              color: Color(0xFF0F2417),
                            ),
                          ),
                          subtitle: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const SizedBox(height: 2),
                              Text(
                                '${plant.scientificName} · ${plant.category}',
                                style: const TextStyle(
                                  fontStyle: FontStyle.italic,
                                  fontSize: 12,
                                  color: Color(0xFF4B6353),
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                plant.overview,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(fontSize: 13, color: Color(0xFF284132)),
                              ),
                            ],
                          ),
                          trailing: const Icon(Icons.chevron_right_rounded),
                          onTap: () => Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => PlantDetailScreen(
                                plant: plant,
                                profile: widget.profile,
                              ),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}
