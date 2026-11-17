class UserProfile {
  final String name;
  final String location;
  final String role;
  final String units;
  final bool autoSaveHistory;
  final bool wateringReminders;
  final bool diseaseAlerts;
  final bool followUpReminders;
  final String customServerUrl;

  const UserProfile({
    this.name = 'Grower',
    this.location = 'Smallholder Farm',
    this.role = 'Farmer & Gardener',
    this.units = 'Metric (°C, mm)',
    this.autoSaveHistory = true,
    this.wateringReminders = true,
    this.diseaseAlerts = true,
    this.followUpReminders = true,
    this.customServerUrl = '',
  });

  UserProfile copyWith({
    String? name,
    String? location,
    String? role,
    String? units,
    bool? autoSaveHistory,
    bool? wateringReminders,
    bool? diseaseAlerts,
    bool? followUpReminders,
    String? customServerUrl,
  }) {
    return UserProfile(
      name: name ?? this.name,
      location: location ?? this.location,
      role: role ?? this.role,
      units: units ?? this.units,
      autoSaveHistory: autoSaveHistory ?? this.autoSaveHistory,
      wateringReminders: wateringReminders ?? this.wateringReminders,
      diseaseAlerts: diseaseAlerts ?? this.diseaseAlerts,
      followUpReminders: followUpReminders ?? this.followUpReminders,
      customServerUrl: customServerUrl ?? this.customServerUrl,
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'location': location,
        'role': role,
        'units': units,
        'autoSaveHistory': autoSaveHistory,
        'wateringReminders': wateringReminders,
        'diseaseAlerts': diseaseAlerts,
        'followUpReminders': followUpReminders,
        'customServerUrl': customServerUrl,
      };

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
        name: json['name']?.toString() ?? 'Grower',
        location: json['location']?.toString() ?? 'Smallholder Farm',
        role: json['role']?.toString() ?? 'Farmer & Gardener',
        units: json['units']?.toString() ?? 'Metric (°C, mm)',
        autoSaveHistory: json['autoSaveHistory'] != false,
        wateringReminders: json['wateringReminders'] != false,
        diseaseAlerts: json['diseaseAlerts'] != false,
        followUpReminders: json['followUpReminders'] != false,
        customServerUrl: json['customServerUrl']?.toString() ?? '',
      );
}
