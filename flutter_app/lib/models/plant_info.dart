class CommonDiseaseInfo {
  final String name;
  final String pathogenType;
  final String symptoms;
  final String prevention;

  const CommonDiseaseInfo({
    required this.name,
    required this.pathogenType,
    required this.symptoms,
    required this.prevention,
  });
}

class PlantInfo {
  final String id;
  final String name;
  final String scientificName;
  final String category;
  final String overview;
  final String sunlight;
  final String water;
  final String soilPh;
  final String temperature;
  final String spacing;
  final String harvestWindow;
  final List<CommonDiseaseInfo> commonDiseases;
  final List<String> preventionAdvice;

  const PlantInfo({
    required this.id,
    required this.name,
    required this.scientificName,
    required this.category,
    required this.overview,
    required this.sunlight,
    required this.water,
    required this.soilPh,
    required this.temperature,
    required this.spacing,
    required this.harvestWindow,
    required this.commonDiseases,
    required this.preventionAdvice,
  });
}
