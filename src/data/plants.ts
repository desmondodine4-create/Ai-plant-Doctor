import type { PlantGuide } from '../types';

export const PLANT_LIBRARY: PlantGuide[] = [
  {
    id: 'tomato',
    name: 'Tomatoes',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetables',
    imageUrl: '/src/assets/images/crop_tomato_leaf_1794854872903.jpg',
    overview:
      'Warm-season fruiting crop prized across home gardens and commercial greenhouses. Highly responsive to consistent deep root watering, trellising, and lower-leaf pruning.',
    sunlight: 'Full sun (6–8 hours daily)',
    water: '25–38 mm/week at root base; keep foliage dry',
    soilPh: '6.0 – 6.8 (well-drained fertile loam)',
    temperature: '20°C – 28°C',
    spacing: '45–60 cm between plants, 90 cm rows',
    harvestWindow: '65–85 days after transplanting',
    commonDiseases: [
      {
        name: 'Early Blight',
        pathogenType: 'Fungal (Alternaria solani)',
        symptoms:
          'Dark brown concentric target-ring lesions on older lower leaves surrounded by yellow chlorotic halos.',
        prevention:
          'Mulch soil surface, prune lowest 20 cm leaves, and rotate away from solanaceous crops for 3 years.',
      },
      {
        name: 'Late Blight',
        pathogenType: 'Oomycete (Phytophthora infestans)',
        symptoms:
          'Water-soaked dark green-black blotches on leaves and stems with pale white downy growth underneath in humid weather.',
        prevention:
          'Provide generous row spacing for airflow, water only in morning, and plant blight-tolerant varieties.',
      },
      {
        name: 'Tomato Yellow Leaf Curl Virus',
        pathogenType: 'Viral (Whitefly-transmitted)',
        symptoms:
          'Upward cupping of young leaves, bright yellow leaf margins, and stunted flower clusters.',
        prevention:
          'Install yellow sticky traps, manage whiteflies early, and remove severely infected plants.',
      },
    ],
    preventionAdvice: [
      'Water early in the morning directly at soil level rather than spraying overhead.',
      'Apply straw or dried grass mulch to prevent soil-borne spores from splashing onto leaves.',
      'Stake or cage vines early so fruit and foliage stay clear of damp soil.',
    ],
  },
  {
    id: 'cassava',
    name: 'Cassava',
    scientificName: 'Manihot esculenta',
    category: 'Root & Tuber Crops',
    imageUrl: '/src/assets/images/crop_cassava_cocoa_1794854873220.jpg',
    overview:
      'Drought-resilient tropical root staple propagated from healthy stem cuttings. Performs best in loose sandy-loam ridges with full sunlight and clean planting material.',
    sunlight: 'Full sun (8+ hours daily)',
    water: 'Low to moderate; intolerant of waterlogged roots',
    soilPh: '5.5 – 6.5 (deep loose sandy loam)',
    temperature: '25°C – 32°C',
    spacing: '100 cm × 100 cm on ridges',
    harvestWindow: '8–12 months after planting',
    commonDiseases: [
      {
        name: 'Cassava Mosaic Disease (CMD)',
        pathogenType: 'Viral (Whitefly-transmitted)',
        symptoms:
          'Patchy yellow-green leaf mottling, distorted leaf blades, and twisted stunted shoots.',
        prevention:
          'Plant certified CMD-resistant clean stem cuttings and rogue out symptomatic plants within the first 2 months.',
      },
      {
        name: 'Cassava Bacterial Blight',
        pathogenType: 'Bacterial (Xanthomonas phaseoli pv. manihotis)',
        symptoms:
          'Angular water-soaked leaf spots, rapid leaf wilting, and stem dieback with amber gummy exudate.',
        prevention:
          'Select clean cuttings from disease-free fields, sanitize machetes between plots, and rotate with legumes.',
      },
    ],
    preventionAdvice: [
      'Take stem stakes only from vigorous, symptom-free mother plants.',
      'Plant on raised ridges or mounds in high-rainfall zones to prevent root rot.',
      'Maintain clean weed control during the critical first 12 weeks.',
    ],
  },
  {
    id: 'maize',
    name: 'Maize (Corn)',
    scientificName: 'Zea mays',
    category: 'Cereal Grains',
    imageUrl: '/src/assets/images/crop_maize_field_1794854873369.jpg',
    overview:
      'High-yielding cereal grain requiring balanced nitrogen nutrition, clean early weeding, and moisture during tasseling and silking.',
    sunlight: 'Full sun (8 hours daily)',
    water: 'Steady moisture during vegetative growth and tasseling',
    soilPh: '5.8 – 7.0 (fertile, well-drained)',
    temperature: '21°C – 30°C',
    spacing: '25–30 cm in rows 75 cm apart',
    harvestWindow: '90–120 days',
    commonDiseases: [
      {
        name: 'Northern Corn Leaf Blight',
        pathogenType: 'Fungal (Exserohilum turcicum)',
        symptoms:
          'Long, cigar-shaped gray-green to tan lesions running along leaf blades.',
        prevention:
          'Bury or compost infected crop debris after harvest and plant tolerant maize hybrids.',
      },
      {
        name: 'Maize Streak Virus',
        pathogenType: 'Viral (Leafhopper-transmitted)',
        symptoms:
          'Narrow, broken chlorotic yellow-white streaks running parallel to leaf veins.',
        prevention:
          'Plant promptly at onset of rains, clear grassy field margins, and choose streak-tolerant seed.',
      },
    ],
    preventionAdvice: [
      'Rotate maize with cowpea, soybean, or groundnuts to disrupt pest cycles and replenish nitrogen.',
      'Inspect leaf whorls weekly for fall armyworm frass and early foliar lesions.',
      'Apply split nitrogen nutrition at planting and knee-high growth stage.',
    ],
  },
  {
    id: 'rice',
    name: 'Rice',
    scientificName: 'Oryza sativa',
    category: 'Cereal Grains',
    overview:
      'Staple cereal grown in irrigated lowland paddies or rainfed upland plots. Benefits from balanced potassium, measured nitrogen, and uniform stand spacing.',
    sunlight: 'Full intense sunlight',
    water: 'Shallow paddy flooding (2–5 cm) or moist upland soil',
    soilPh: '5.5 – 6.5',
    temperature: '22°C – 32°C',
    spacing: '20 cm × 20 cm',
    harvestWindow: '105–135 days',
    commonDiseases: [
      {
        name: 'Rice Blast',
        pathogenType: 'Fungal (Magnaporthe oryzae)',
        symptoms:
          'Spindle or diamond-shaped lesions with gray-white centers and dark brown borders on leaves and panicle necks.',
        prevention:
          'Avoid excessive nitrogen applications, keep water depth uniform, and plant blast-resistant cultivars.',
      },
      {
        name: 'Bacterial Leaf Blight',
        pathogenType: 'Bacterial (Xanthomonas oryzae)',
        symptoms:
          'Pale yellow-orange wavy stripes moving downward from leaf tips and margins, drying to straw white.',
        prevention:
          'Avoid deep stagnant water during outbreaks and balance potassium with nitrogen.',
      },
    ],
    preventionAdvice: [
      'Sow clean certified seed and maintain healthy nursery beds.',
      'Avoid excess urea fertilizer that creates soft, blast-prone leaves.',
      'Clear grassy bund weeds that shelter stem borers and pathogens.',
    ],
  },
  {
    id: 'pepper',
    name: 'Pepper (Chili & Sweet)',
    scientificName: 'Capsicum annuum',
    category: 'Vegetables',
    overview:
      'Warm-weather fruiting crop sensitive to saturated roots and extreme heat stress. Thrives with steady calcium, compost, and drip irrigation.',
    sunlight: 'Full sun (6–8 hours)',
    water: 'Moderate even moisture; allow top 2 cm soil to dry slightly',
    soilPh: '6.0 – 6.8',
    temperature: '21°C – 29°C',
    spacing: '45 cm × 60 cm',
    harvestWindow: '70–90 days from transplant',
    commonDiseases: [
      {
        name: 'Anthracnose Fruit Rot',
        pathogenType: 'Fungal (Colletotrichum spp.)',
        symptoms:
          'Sunken circular dark lesions on ripening pods showing concentric spore rings in humid weather.',
        prevention:
          'Harvest ripe peppers promptly, mulch beds, and rotate away from tomatoes or eggplant.',
      },
      {
        name: 'Bacterial Leaf Spot',
        pathogenType: 'Bacterial (Xanthomonas spp.)',
        symptoms:
          'Small water-soaked spots turning dark brown with yellow halos, causing premature leaf drop.',
        prevention:
          'Avoid handling wet foliage and start with pathogen-tested seed.',
      },
    ],
    preventionAdvice: [
      'Switch from overhead watering to root-zone drip or watering-can irrigation.',
      'Maintain steady soil calcium and moisture to avoid blossom-end rot.',
      'Use clean straw mulch to reduce soil splash and deter thrips.',
    ],
  },
  {
    id: 'beans',
    name: 'Beans & Cowpeas',
    scientificName: 'Phaseolus vulgaris / Vigna unguiculata',
    category: 'Legumes',
    overview:
      'Nitrogen-fixing legumes suited to sole cropping or maize intercropping. Sensitive to handling while leaves are wet with morning dew.',
    sunlight: 'Full sun (6+ hours)',
    water: 'Moderate; critical during flowering and pod fill',
    soilPh: '6.0 – 7.0',
    temperature: '18°C – 28°C',
    spacing: '15–20 cm in rows 45 cm apart',
    harvestWindow: '55–80 days',
    commonDiseases: [
      {
        name: 'Bean Rust',
        pathogenType: 'Fungal (Uromyces appendiculatus)',
        symptoms:
          'Tiny reddish-brown powdery pustules mainly on lower leaf surfaces surrounded by pale halos.',
        prevention:
          'Plant rust-resistant varieties and avoid dense shading or overcrowding.',
      },
      {
        name: 'Angular Leaf Spot',
        pathogenType: 'Fungal (Pseudocercospora griseola)',
        symptoms:
          'Gray-brown angular lesions sharply bounded by leaf veins.',
        prevention:
          'Use certified disease-free seed and practice 2-year crop rotation.',
      },
    ],
    preventionAdvice: [
      'Avoid walking through or harvesting bean plots when foliage is wet.',
      'Inoculate seed with rhizobium where legumes have not recently grown.',
    ],
  },
  {
    id: 'plantain',
    name: 'Plantain & Banana',
    scientificName: 'Musa paradisiaca',
    category: 'Orchard & Perennial Crops',
    overview:
      'Tropical perennial clump crop requiring abundant organic mulch, wind shelter, and disciplined pruning of excess suckers.',
    sunlight: 'Full sun to light afternoon shade',
    water: 'High steady moisture with fast drainage',
    soilPh: '5.5 – 7.0 (rich humus)',
    temperature: '24°C – 32°C',
    spacing: '3 m × 3 m',
    harvestWindow: '10–14 months from planting',
    commonDiseases: [
      {
        name: 'Black Sigatoka',
        pathogenType: 'Fungal (Pseudocercospora fijiensis)',
        symptoms:
          'Fine reddish-brown flecks on lower leaves expanding into dark black necrotic streaks that dry out leaf blades.',
        prevention:
          'De-leaf heavily spotted older leaves cleanly and maintain open spacing for wind circulation.',
      },
      {
        name: 'Panama Disease (Fusarium Wilt)',
        pathogenType: 'Soil-borne Fungal (Fusarium oxysporum)',
        symptoms:
          'Yellowing advancing inward from older outer leaf margins, splitting at pseudostem base.',
        prevention:
          'Plant clean tissue-culture plantlets and disinfect farm tools between mats.',
      },
    ],
    preventionAdvice: [
      'Keep 1 bearing mother stem, 1 follower sucker, and 1 young peeper per mat.',
      'Mulch thickly around the clump base with compost and chopped organic matter.',
    ],
  },
  {
    id: 'cocoa',
    name: 'Cocoa',
    scientificName: 'Theobroma cacao',
    category: 'Tree & Cash Crops',
    imageUrl: '/src/assets/images/crop_cassava_cocoa_1794854873220.jpg',
    overview:
      'Shade-adapted tropical tree producing pods along the main trunk and branches. Canopy sanitation and timely pod harvesting are essential.',
    sunlight: 'Filtered shade (30–50% shade during establishment)',
    water: '1,500–2,000 mm/year well-distributed rainfall',
    soilPh: '5.5 – 6.8 (deep organic loam)',
    temperature: '22°C – 30°C',
    spacing: '3 m × 3 m',
    harvestWindow: 'Year-round peak flushes after year 3–4',
    commonDiseases: [
      {
        name: 'Black Pod Disease',
        pathogenType: 'Oomycete (Phytophthora megakarya / palmivora)',
        symptoms:
          'Rapidly expanding dark brown-black firm rot on pods covered by fine white mold in humid weather.',
        prevention:
          'Harvest ripe pods weekly, remove mummified black pods from trees immediately, and prune dense shade.',
      },
      {
        name: 'Cocoa Swollen Shoot Virus',
        pathogenType: 'Viral (Mealybug-transmitted)',
        symptoms:
          'Red vein banding on young flush leaves and abnormal stem or root swellings.',
        prevention:
          'Remove infected trees early and replant with tolerant hybrid seedlings.',
      },
    ],
    preventionAdvice: [
      'Prune chupons and interlocking overhead branches before peak rainy months.',
      'Bury or remove diseased black pods far from healthy cocoa trunks.',
    ],
  },
  {
    id: 'sweet-potato',
    name: 'Sweet Potato',
    scientificName: 'Ipomoea batatas',
    category: 'Root & Tuber Crops',
    overview:
      'Fast-covering vining tuber crop grown from clean vine tip cuttings. Naturally suppresses weeds once canopy closes.',
    sunlight: 'Full sun (6–8 hours)',
    water: 'Moderate; reduce watering 2 weeks before harvest',
    soilPh: '5.5 – 6.5 (sandy loam ridges)',
    temperature: '22°C – 30°C',
    spacing: '30 cm along ridges 90 cm apart',
    harvestWindow: '90–120 days',
    commonDiseases: [
      {
        name: 'Sweet Potato Virus Disease',
        pathogenType: 'Viral complex (Aphid & Whitefly)',
        symptoms:
          'Severe stunting, narrow strapped leaves, chlorotic mottling, and poor tuber yield.',
        prevention:
          'Plant clean vine cuttings from nursery beds and isolate from older infected fields.',
      },
    ],
    preventionAdvice: [
      'Use only young, vigorous terminal vine cuttings free of mosaic symptoms.',
      'Hill up soil around vines to protect developing roots from sweet potato weevils.',
    ],
  },
  {
    id: 'coffee',
    name: 'Coffee',
    scientificName: 'Coffea arabica / canephora',
    category: 'Tree & Cash Crops',
    overview:
      'Perennial evergreen shrub flourishing in cool tropical highlands (Arabica) or humid lowlands (Robusta) with balanced canopy shade.',
    sunlight: 'Morning sun with light afternoon shade',
    water: 'Steady rainfall with dry spell to trigger uniform flowering',
    soilPh: '5.5 – 6.5 (rich volcanic or forest loam)',
    temperature: '18°C – 26°C',
    spacing: '2.5 m × 2.5 m',
    harvestWindow: '8–9 months after flowering',
    commonDiseases: [
      {
        name: 'Coffee Leaf Rust',
        pathogenType: 'Fungal (Hemileia vastatrix)',
        symptoms:
          'Pale yellow spots on upper leaf surfaces matching bright orange powdery pustules underneath.',
        prevention:
          'Prune open tree centers for airflow, apply balanced nutrition, and plant rust-resistant cultivars.',
      },
    ],
    preventionAdvice: [
      'Desucker and prune annually after main harvest to keep foliage airy.',
      'Mulch beneath trees to preserve moisture and reduce weed competition.',
    ],
  },
];
