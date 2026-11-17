import 'package:flutter/material.dart';
import '../models/user_profile.dart';

class ProfileScreen extends StatefulWidget {
  final UserProfile profile;
  final Future<void> Function(UserProfile) onSaveProfile;

  const ProfileScreen({
    super.key,
    required this.profile,
    required this.onSaveProfile,
  });

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late final TextEditingController _nameController =
      TextEditingController(text: widget.profile.name);
  late final TextEditingController _locationController =
      TextEditingController(text: widget.profile.location);
  late final TextEditingController _serverController =
      TextEditingController(text: widget.profile.customServerUrl);

  @override
  void dispose() {
    _nameController.dispose();
    _locationController.dispose();
    _serverController.dispose();
    super.dispose();
  }

  void _update(UserProfile next) {
    widget.onSaveProfile(next);
  }

  @override
  Widget build(BuildContext context) {
    final p = widget.profile;

    return Scaffold(
      backgroundColor: const Color(0xFFF6FAF6),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF6FAF6),
        surfaceTintColor: Colors.transparent,
        title: const Text(
          'Profile & Settings',
          style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF0F2417)),
        ),
      ),
      body: ListView(
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 32),
        children: [
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
                  'Grower Profile',
                  style: TextStyle(fontWeight: FontWeight.w700, fontSize: 16),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: _nameController,
                  decoration: const InputDecoration(labelText: 'Name'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _locationController,
                  decoration: const InputDecoration(labelText: 'Farm / Garden Location'),
                ),
                const SizedBox(height: 10),
                TextField(
                  controller: _serverController,
                  decoration: const InputDecoration(
                    labelText: 'Backend Server URL (Optional Override)',
                    hintText: 'Leave empty to use default secure backend',
                  ),
                ),
                const SizedBox(height: 14),
                FilledButton(
                  onPressed: () {
                    _update(
                      p.copyWith(
                        name: _nameController.text.trim().isEmpty
                            ? 'Grower'
                            : _nameController.text.trim(),
                        location: _locationController.text.trim(),
                        customServerUrl: _serverController.text.trim(),
                      ),
                    );
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Profile & preferences saved.')),
                    );
                  },
                  style: FilledButton.styleFrom(backgroundColor: const Color(0xFF14532D)),
                  child: const Text('Save Profile'),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFDCE8DE)),
            ),
            child: Column(
              children: [
                SwitchListTile(
                  title: const Text('Auto-Save Diagnosis Reports'),
                  subtitle: const Text('Keep every completed scan on your device'),
                  value: p.autoSaveHistory,
                  onChanged: (v) => _update(p.copyWith(autoSaveHistory: v)),
                ),
                const Divider(height: 1),
                SwitchListTile(
                  title: const Text('Watering Check Reminders'),
                  value: p.wateringReminders,
                  onChanged: (v) => _update(p.copyWith(wateringReminders: v)),
                ),
                const Divider(height: 1),
                SwitchListTile(
                  title: const Text('Disease Outbreak & Follow-Up Alerts'),
                  value: p.diseaseAlerts,
                  onChanged: (v) => _update(p.copyWith(diseaseAlerts: v)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 14),
          Container(
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFFDCE8DE)),
            ),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.info_outline_rounded, color: Color(0xFF14532D)),
                  title: const Text('About AI Plant Doctor'),
                  subtitle: const Text('Version 1.0.0 · Powered by Gemini AI'),
                  onTap: () => showDialog(
                    context: context,
                    builder: (_) => AlertDialog(
                      title: const Text('About AI Plant Doctor'),
                      content: const Text(
                        'AI Plant Doctor helps farmers, gardeners, and agricultural students diagnose crop diseases and follow practical treatment steps using server-side Gemini multimodal AI.',
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('Close'),
                        ),
                      ],
                    ),
                  ),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.privacy_tip_outlined, color: Color(0xFF14532D)),
                  title: const Text('Privacy Policy'),
                  subtitle: const Text('Diagnosis history & images stay stored locally'),
                  onTap: () => showDialog(
                    context: context,
                    builder: (_) => AlertDialog(
                      title: const Text('Privacy Policy'),
                      content: const Text(
                        'Plant images submitted for diagnosis are sent over HTTPS to our secure backend solely to perform Gemini plant health analysis. Your saved history and profile remain on your device.',
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('Understood'),
                        ),
                      ],
                    ),
                  ),
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.help_outline_rounded, color: Color(0xFF14532D)),
                  title: const Text('Help & Support'),
                  subtitle: const Text('Photo tips & troubleshooting'),
                  onTap: () => showDialog(
                    context: context,
                    builder: (_) => AlertDialog(
                      title: const Text('Photo Tips for Best Accuracy'),
                      content: const Text(
                        '1. Photograph affected leaves in bright natural daylight.\n'
                        '2. Hold the phone 15–30 cm away so spots and textures are crisp.\n'
                        '3. Capture both upper and underside symptoms when possible.',
                      ),
                      actions: [
                        TextButton(
                          onPressed: () => Navigator.pop(context),
                          child: const Text('Got It'),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
