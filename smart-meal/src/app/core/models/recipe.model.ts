export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type DietaryTag = 'vegetarian' | 'vegan' | 'gluten-free' | 'dairy-free';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbohydrates: number;
  fats: number;
  fiber: number;
}

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category: 'protein' | 'vegetables' | 'fruits' | 'grains' | 'dairy' | 'other';
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  nutrition: NutritionInfo;
  ingredients: Ingredient[];
  instructions: string[];
  mealTypes: MealType[];
  dietaryTags: DietaryTag[];
  difficulty: Difficulty;
}