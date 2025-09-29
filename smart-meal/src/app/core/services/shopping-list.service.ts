import { Injectable, computed, signal } from '@angular/core';
import { MealPlannerService } from './meal-planner.service';
import { RecipeService } from './recipe.service';
import { Ingredient } from '../models/recipe.model';

export interface ShoppingItem extends Ingredient {
  checked: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  private checkedItemsSignal = signal<Set<string>>(new Set());

  shoppingList = computed(() => {
    const plan = this.mealPlanner.weekPlan();
    const items = new Map<string, ShoppingItem>();

    Object.values(plan.days).forEach(dayPlan => {
      Object.values(dayPlan.meals).forEach(recipeId => {
        if (!recipeId) return;
        
        const recipe = this.recipeService.getRecipeById(recipeId);
        if (!recipe) return;

        recipe.ingredients.forEach(ingredient => {
          const key = `${ingredient.name}-${ingredient.unit}`;
          
          if (items.has(key)) {
            const existing = items.get(key)!;
            existing.amount += ingredient.amount;
          } else {
            items.set(key, {
              ...ingredient,
              checked: this.checkedItemsSignal().has(key)
            });
          }
        });
      });
    });

    return Array.from(items.values()).sort((a, b) => 
      a.category.localeCompare(b.category)
    );
  });

  constructor(
    private mealPlanner: MealPlannerService,
    private recipeService: RecipeService
  ) {}

  toggleItem(item: ShoppingItem): void {
    const key = `${item.name}-${item.unit}`;
    this.checkedItemsSignal.update(checked => {
      const newSet = new Set(checked);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  }

  clearChecked(): void {
    this.checkedItemsSignal.set(new Set());
  }
}