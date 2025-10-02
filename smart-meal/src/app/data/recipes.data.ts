import { Recipe } from '../core/models/recipe.model';

export const RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Owsianka z owocami',
    description: 'Pożywne śniadanie pełne błonnika',
    imageUrl: 'https://cdn.aniagotuje.com/pictures/articles/2022/05/27876793-v-1500x1500.jpg',
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    nutrition: { calories: 350, protein: 12, carbohydrates: 58, fats: 9, fiber: 8 },
    ingredients: [
      { name: 'Płatki owsiane', amount: 60, unit: 'g', category: 'grains' },
      { name: 'Mleko roślinne', amount: 250, unit: 'ml', category: 'dairy' },
      { name: 'Banan', amount: 1, unit: 'szt', category: 'fruits' },
      { name: 'Jagody', amount: 50, unit: 'g', category: 'fruits' },
      { name: 'Orzechy', amount: 15, unit: 'g', category: 'other' }
    ],
    instructions: [
      'Zagotuj mleko w garnku',
      'Dodaj płatki owsiane i gotuj 5-7 minut',
      'Dodaj pokrojone owoce i orzechy'
    ],
    mealTypes: ['breakfast'],
    dietaryTags: ['vegetarian'],
    difficulty: 'easy'
  },
  {
    id: '2',
    name: 'Sałatka z kurczakiem',
    description: 'Lekki lunch bogaty w białko',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400',
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    nutrition: { calories: 420, protein: 35, carbohydrates: 18, fats: 24, fiber: 8 },
    ingredients: [
      { name: 'Filet z kurczaka', amount: 200, unit: 'g', category: 'protein' },
      { name: 'Mix sałat', amount: 150, unit: 'g', category: 'vegetables' },
      { name: 'Awokado', amount: 1, unit: 'szt', category: 'vegetables' },
      { name: 'Pomidorki', amount: 100, unit: 'g', category: 'vegetables' },
      { name: 'Oliwa', amount: 2, unit: 'łyżki', category: 'other' }
    ],
    instructions: [
      'Pokrój kurczaka i opiecz na patelni',
      'Przygotuj warzywa',
      'Wymieszaj wszystko i polej oliwą'
    ],
    mealTypes: ['lunch', 'dinner'],
    dietaryTags: ['gluten-free'],
    difficulty: 'easy'
  },
  {
    id: '3',
    name: 'Łosoś z warzywami',
    description: 'Obiad bogaty w omega-3',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    prepTime: 10,
    cookTime: 25,
    servings: 2,
    nutrition: { calories: 520, protein: 38, carbohydrates: 42, fats: 22, fiber: 7 },
    ingredients: [
      { name: 'Filet z łososia', amount: 250, unit: 'g', category: 'protein' },
      { name: 'Batat', amount: 300, unit: 'g', category: 'vegetables' },
      { name: 'Brokuły', amount: 200, unit: 'g', category: 'vegetables' },
      { name: 'Oliwa', amount: 2, unit: 'łyżki', category: 'other' }
    ],
    instructions: [
      'Rozgrzej piekarnik do 200°C',
      'Piecz batata 20 minut',
      'Opiecz łososia na patelni',
      'Ugotuj brokuły na parze'
    ],
    mealTypes: ['dinner'],
    dietaryTags: ['gluten-free', 'dairy-free'],
    difficulty: 'medium'
  },
  {
    id: '4',
    name: 'Smoothie bowl',
    description: 'Energetyczne śniadanie',
    imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400',
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    nutrition: { calories: 320, protein: 8, carbohydrates: 52, fats: 11, fiber: 10 },
    ingredients: [
      { name: 'Mrożone jagody', amount: 150, unit: 'g', category: 'fruits' },
      { name: 'Banan', amount: 1, unit: 'szt', category: 'fruits' },
      { name: 'Jogurt', amount: 100, unit: 'g', category: 'dairy' },
      { name: 'Granola', amount: 30, unit: 'g', category: 'grains' }
    ],
    instructions: [
      'Zmiksuj jagody, banana i jogurt',
      'Przelej do miski',
      'Dodaj granolę i świeże owoce'
    ],
    mealTypes: ['breakfast'],
    dietaryTags: ['vegetarian'],
    difficulty: 'easy'
  },
  {
    id: '5',
    name: 'Makaron z warzywami',
    description: 'Wegański obiad',
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    nutrition: { calories: 380, protein: 14, carbohydrates: 68, fats: 8, fiber: 12 },
    ingredients: [
      { name: 'Makaron pełnoziarnisty', amount: 200, unit: 'g', category: 'grains' },
      { name: 'Cukinia', amount: 1, unit: 'szt', category: 'vegetables' },
      { name: 'Papryka', amount: 1, unit: 'szt', category: 'vegetables' },
      { name: 'Szpinak', amount: 100, unit: 'g', category: 'vegetables' }
    ],
    instructions: [
      'Ugotuj makaron al dente',
      'Podsmaż warzywa na patelni',
      'Wymieszaj makaron z warzywami'
    ],
    mealTypes: ['lunch', 'dinner'],
    dietaryTags: ['vegan', 'dairy-free'],
    difficulty: 'easy'
  },
  {
    id: '6',
    name: 'Wrap z indykiem',
    description: 'Szybki lunch',
    imageUrl: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400',
    prepTime: 10,
    cookTime: 0,
    servings: 1,
    nutrition: { calories: 390, protein: 32, carbohydrates: 42, fats: 12, fiber: 8 },
    ingredients: [
      { name: 'Tortilla', amount: 1, unit: 'szt', category: 'grains' },
      { name: 'Indyk', amount: 100, unit: 'g', category: 'protein' },
      { name: 'Hummus', amount: 3, unit: 'łyżki', category: 'other' },
      { name: 'Sałata', amount: 50, unit: 'g', category: 'vegetables' }
    ],
    instructions: [
      'Rozsmaruj hummus na tortilli',
      'Dodaj indyka i warzywa',
      'Zwiń tortillę'
    ],
    mealTypes: ['lunch', 'snack'],
    dietaryTags: ['dairy-free'],
    difficulty: 'easy'
  },
  {
    id: '7',
    name: 'Jajecznica z pomidorami',
    description: 'Klasyczne, szybkie śniadanie bogate w białko.',
    imageUrl: 'https://kuchnialidla.pl/img/PL/960x540/a14d2d154df3-914af35d4af8-kremowa-jajecznica-z-pomidorami-kuchnialidla-1250x700.webp',
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    nutrition: { calories: 280, protein: 18, carbohydrates: 6, fats: 20, fiber: 2 },
    ingredients: [
      { name: 'Jajka', amount: 3, unit: 'szt', category: 'protein' },
      { name: 'Pomidor', amount: 1, unit: 'szt', category: 'vegetables' },
      { name: 'Masło', amount: 1, unit: 'łyżka', category: 'other' },
      { name: 'Szczypiorek', amount: 5, unit: 'g', category: 'vegetables' }
    ],
    instructions: [
      'Rozgrzej masło na patelni.',
      'Dodaj pokrojone pomidory i podsmaż przez chwilę.',
      'Dodaj jajka i smaż mieszając do uzyskania odpowiedniej konsystencji.',
      'Posyp szczypiorkiem i podawaj.'
    ],
    mealTypes: ['breakfast'],
    dietaryTags: ['gluten-free'],
    difficulty: 'easy'
  },
  {
    id: '8',
    name: 'Kanapki z awokado i jajkiem',
    description: 'Zdrowe i pożywne śniadanie pełne zdrowych tłuszczów.',
    imageUrl: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    nutrition: { calories: 350, protein: 14, carbohydrates: 32, fats: 18, fiber: 7 },
    ingredients: [
      { name: 'Chleb pełnoziarnisty', amount: 4, unit: 'kromki', category: 'grains' },
      { name: 'Awokado', amount: 1, unit: 'szt', category: 'vegetables' },
      { name: 'Jajko ugotowane', amount: 2, unit: 'szt', category: 'protein' },
      { name: 'Rukola', amount: 30, unit: 'g', category: 'vegetables' }
    ],
    instructions: [
      'Rozgnieć awokado i posmaruj kromki chleba.',
      'Pokrój jajka na plasterki i ułóż na kanapkach.',
      'Dodaj rukolę i dopraw do smaku.'
    ],
    mealTypes: ['breakfast'],
    dietaryTags: ['vegetarian'],
    difficulty: 'easy'
  },
  {
    id: '9',
    name: 'Jogurt grecki z miodem i orzechami',
    description: 'Błyskawiczne śniadanie bogate w białko i wapń.',
    imageUrl: 'https://www.foodpal-app.com/uploads/images/meals/2828/cremiger-griechischer-joghurt-mit-nuessen-und-honig-5f8ab2fbb781e-1000.webp',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    nutrition: { calories: 320, protein: 15, carbohydrates: 28, fats: 15, fiber: 2 },
    ingredients: [
      { name: 'Jogurt grecki', amount: 200, unit: 'g', category: 'dairy' },
      { name: 'Miód', amount: 1, unit: 'łyżka', category: 'other' },
      { name: 'Orzechy włoskie', amount: 20, unit: 'g', category: 'other' }
    ],
    instructions: [
      'Przełóż jogurt do miseczki.',
      'Polej miodem i posyp orzechami.'
    ],
    mealTypes: ['breakfast'],
    dietaryTags: ['vegetarian', 'gluten-free'],
    difficulty: 'easy'
  },
  {
    id: '10',
    name: 'Owsianka czekoladowa z bananem',
    description: 'Energetyczne śniadanie dla łasuchów.',
    imageUrl: 'https://na-talerzu.pl/wp-content/uploads/2021/04/Nocna-owsianka-czekoladowa-z-bananem-4405.jpg',
    prepTime: 5,
    cookTime: 10,
    servings: 1,
    nutrition: { calories: 370, protein: 11, carbohydrates: 64, fats: 9, fiber: 8 },
    ingredients: [
      { name: 'Płatki owsiane', amount: 60, unit: 'g', category: 'grains' },
      { name: 'Mleko', amount: 200, unit: 'ml', category: 'dairy' },
      { name: 'Banan', amount: 1, unit: 'szt', category: 'fruits' },
      { name: 'Kakao', amount: 1, unit: 'łyżka', category: 'other' }
    ],
    instructions: [
      'Ugotuj owsiankę na mleku.',
      'Dodaj kakao i wymieszaj.',
      'Podawaj z pokrojonym bananem.'
    ],
    mealTypes: ['breakfast'],
    dietaryTags: ['vegetarian'],
    difficulty: 'easy'
  },
  {
    id: '11',
    name: 'Omlet warzywny',
    description: 'Lekki, sycący omlet z warzywami sezonowymi.',
    imageUrl: 'https://www.mojegotowanie.pl/media/cache/big/uploads/media/recipe/0002/07/omlet-z-warzywami.jpeg',
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    nutrition: { calories: 290, protein: 19, carbohydrates: 7, fats: 22, fiber: 3 },
    ingredients: [
      { name: 'Jajka', amount: 3, unit: 'szt', category: 'protein' },
      { name: 'Papryka', amount: 0.5, unit: 'szt', category: 'vegetables' },
      { name: 'Cebula', amount: 0.5, unit: 'szt', category: 'vegetables' },
      { name: 'Szpinak', amount: 50, unit: 'g', category: 'vegetables' },
      { name: 'Oliwa', amount: 1, unit: 'łyżka', category: 'other' }
    ],
    instructions: [
      'Podsmaż pokrojone warzywa na oliwie.',
      'Wlej roztrzepane jajka i smaż do ścięcia.',
      'Złóż omlet na pół i podawaj.'
    ],
    mealTypes: ['breakfast'],
    dietaryTags: ['gluten-free', 'vegetarian'],
    difficulty: 'easy'
  },
  {
    id: '12',
    name: 'Kurczak curry z ryżem',
    description: 'Aromatyczny obiad inspirowany kuchnią indyjską.',
    imageUrl: 'https://mwrzosek-prod-wp-static.s3.eu-central-1.amazonaws.com/wp-content/uploads/2017/12/17235707/Kurczak-curry-male.png',
    prepTime: 15,
    cookTime: 25,
    servings: 2,
    nutrition: { calories: 520, protein: 36, carbohydrates: 60, fats: 16, fiber: 6 },
    ingredients: [
      { name: 'Filet z kurczaka', amount: 300, unit: 'g', category: 'protein' },
      { name: 'Ryż basmati', amount: 150, unit: 'g', category: 'grains' },
      { name: 'Mleczko kokosowe', amount: 200, unit: 'ml', category: 'other' },
      { name: 'Pasta curry', amount: 2, unit: 'łyżki', category: 'other' },
      { name: 'Cebula', amount: 1, unit: 'szt', category: 'vegetables' }
    ],
    instructions: [
      'Ugotuj ryż według przepisu na opakowaniu.',
      'Podsmaż cebulę i kurczaka, dodaj pastę curry.',
      'Zalej mleczkiem kokosowym i gotuj 15 minut.',
      'Podawaj z ryżem.'
    ],
    mealTypes: ['lunch', 'dinner'],
    dietaryTags: ['gluten-free'],
    difficulty: 'medium'
  },
  {
    id: '13',
    name: 'Łosoś pieczony z warzywami',
    description: 'Zdrowy obiad bogaty w kwasy omega-3.',
    imageUrl: 'https://www.pasjasmaku.com/wp-content/uploads/2020/03/%C5%82oso%C5%9B-pieczony-z-warzywami.jpg',
    prepTime: 10,
    cookTime: 20,
    servings: 2,
    nutrition: { calories: 480, protein: 38, carbohydrates: 18, fats: 28, fiber: 5 },
    ingredients: [
      { name: 'Filet z łososia', amount: 300, unit: 'g', category: 'protein' },
      { name: 'Brokuł', amount: 200, unit: 'g', category: 'vegetables' },
      { name: 'Marchew', amount: 150, unit: 'g', category: 'vegetables' },
      { name: 'Oliwa', amount: 2, unit: 'łyżki', category: 'other' },
      { name: 'Cytryna', amount: 0.5, unit: 'szt', category: 'fruits' }
    ],
    instructions: [
      'Ułóż łososia i warzywa na blaszce.',
      'Skrop oliwą i sokiem z cytryny.',
      'Piecz 20 minut w 180°C.'
    ],
    mealTypes: ['lunch', 'dinner'],
    dietaryTags: ['gluten-free'],
    difficulty: 'easy'
  },
  {
    id: '14',
    name: 'Spaghetti bolognese',
    description: 'Włoski klasyk z sosem mięsnym i makaronem.',
    imageUrl: 'https://cdn.aniagotuje.com/pictures/articles/2024/05/61816588-v-1500x1500.jpg',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    nutrition: { calories: 610, protein: 28, carbohydrates: 78, fats: 20, fiber: 7 },
    ingredients: [
      { name: 'Makaron spaghetti', amount: 300, unit: 'g', category: 'grains' },
      { name: 'Mięso mielone wołowe', amount: 400, unit: 'g', category: 'protein' },
      { name: 'Pomidory w puszce', amount: 400, unit: 'g', category: 'vegetables' },
      { name: 'Cebula', amount: 1, unit: 'szt', category: 'vegetables' },
      { name: 'Czosnek', amount: 2, unit: 'ząbki', category: 'vegetables' }
    ],
    instructions: [
      'Ugotuj makaron al dente.',
      'Podsmaż cebulę i czosnek, dodaj mięso i obsmaż.',
      'Dodaj pomidory i gotuj 20 minut.',
      'Podawaj z makaronem.'
    ],
    mealTypes: ['lunch', 'dinner'],
    dietaryTags: [],
    difficulty: 'medium'
  },
  {
    id: '15',
    name: 'Sałatka grecka',
    description: 'Świeża, lekka sałatka z fetą i oliwkami.',
    imageUrl: 'https://czasopismo.klarstein.pl/wp-content/uploads/2023/03/KS_Magazine_0323_Griechischer-Salat_1300x1300px.jpg',
    prepTime: 10,
    cookTime: 0,
    servings: 2,
    nutrition: { calories: 350, protein: 10, carbohydrates: 18, fats: 28, fiber: 5 },
    ingredients: [
      { name: 'Ogórek', amount: 1, unit: 'szt', category: 'vegetables' },
      { name: 'Pomidor', amount: 2, unit: 'szt', category: 'vegetables' },
      { name: 'Ser feta', amount: 100, unit: 'g', category: 'dairy' },
      { name: 'Oliwki', amount: 50, unit: 'g', category: 'other' },
      { name: 'Oliwa', amount: 2, unit: 'łyżki', category: 'other' }
    ],
    instructions: [
      'Pokrój warzywa i fetę.',
      'Dodaj oliwki i polej oliwą.',
      'Wymieszaj delikatnie i podawaj.'
    ],
    mealTypes: ['lunch', 'dinner'],
    dietaryTags: ['vegetarian', 'gluten-free'],
    difficulty: 'easy'
  },
  {
    id: '16',
    name: 'Kurczak teriyaki z warzywami',
    description: 'Szybki obiad w stylu azjatyckim.',
    imageUrl: 'https://cdn.aniagotuje.com/pictures/articles/2024/02/57059067-v-1500x1500.jpg',
    prepTime: 15,
    cookTime: 15,
    servings: 2,
    nutrition: { calories: 480, protein: 34, carbohydrates: 40, fats: 18, fiber: 5 },
    ingredients: [
      { name: 'Filet z kurczaka', amount: 250, unit: 'g', category: 'protein' },
      { name: 'Papryka', amount: 1, unit: 'szt', category: 'vegetables' },
      { name: 'Cebula', amount: 1, unit: 'szt', category: 'vegetables' },
      { name: 'Sos teriyaki', amount: 3, unit: 'łyżki', category: 'other' },
      { name: 'Ryż jaśminowy', amount: 150, unit: 'g', category: 'grains' }
    ],
    instructions: [
      'Ugotuj ryż.',
      'Podsmaż kurczaka i warzywa.',
      'Dodaj sos teriyaki i wymieszaj.',
      'Podawaj z ryżem.'
    ],
    mealTypes: ['lunch', 'dinner'],
    dietaryTags: [],
    difficulty: 'medium'
  }
];