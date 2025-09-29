import { Recipe } from '../core/models/recipe.model';

export const RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'Owsianka z owocami',
    description: 'Pożywne śniadanie pełne błonnika',
    imageUrl: 'https://images.unsplash.com/photo-1517673132405-a56a62b18caf?w=400',
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
  }
];