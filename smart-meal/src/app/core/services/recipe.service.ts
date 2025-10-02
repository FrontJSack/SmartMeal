import { Injectable, signal, computed } from '@angular/core';
import { Recipe, MealType, DietaryTag } from '../models/recipe.model';
import { RECIPES } from '../../data/recipes.data';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipesSignal = signal<Recipe[]>(RECIPES);
  private searchTermSignal = signal<string>('');
  private selectedMealTypesSignal = signal<MealType[]>([]);
  private selectedDietaryTagsSignal = signal<DietaryTag[]>([]);

  recipes = this.recipesSignal.asReadonly();
  
  filteredRecipes = computed(() => {
    const recipes = this.recipesSignal();
    const searchTerm = this.searchTermSignal().toLowerCase();
    const mealTypes = this.selectedMealTypesSignal();
    const dietaryTags = this.selectedDietaryTagsSignal();

    return recipes.filter(recipe => {
      const matchesSearch = !searchTerm || 
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm);

      const matchesMealType = mealTypes.length === 0 ||
        mealTypes.some(type => recipe.mealTypes.includes(type));

      const matchesDietary = dietaryTags.length === 0 ||
        dietaryTags.every(tag => recipe.dietaryTags.includes(tag));

      return matchesSearch && matchesMealType && matchesDietary;
    });
  });

  getRecipeById(id: string): Recipe | undefined {
    return this.recipesSignal().find(r => r.id === id);
  }

  setSearchTerm(term: string): void {
    this.searchTermSignal.set(term);
  }

  setMealTypes(types: MealType[]): void {
    this.selectedMealTypesSignal.set(types);
  }

  setDietaryTags(tags: DietaryTag[]): void {
    this.selectedDietaryTagsSignal.set(tags);
  }

  clearFilters(): void {
    this.searchTermSignal.set('');
    this.selectedMealTypesSignal.set([]);
    this.selectedDietaryTagsSignal.set([]);
  }
}