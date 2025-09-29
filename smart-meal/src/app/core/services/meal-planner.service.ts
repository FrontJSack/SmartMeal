import { Injectable, signal, computed } from '@angular/core';
import { DayOfWeek, WeekPlan, DayPlan } from '../models/meal-plan.model';
import { MealType, Recipe } from '../models/recipe.model';
import { NutritionInfo } from '../models/recipe.model';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})
export class MealPlannerService {
  private weekPlanSignal = signal<WeekPlan>(this.initWeekPlan());

  weekPlan = this.weekPlanSignal.asReadonly();

  constructor(private recipeService: RecipeService) {
    this.loadFromStorage();
  }

  private initWeekPlan(): WeekPlan {
    const today = new Date();
    const weekStart = this.getMonday(today);
    const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    const plan: WeekPlan = {
      weekStart,
      days: {} as Record<DayOfWeek, DayPlan>
    };

    days.forEach((day, index) => {
      const date = new Date(weekStart);
      date.setDate(weekStart.getDate() + index);
      plan.days[day] = {
        date,
        meals: {
          breakfast: null,
          lunch: null,
          dinner: null,
          snack: null
        }
      };
    });

    return plan;
  }

  private getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  addMeal(day: DayOfWeek, mealType: MealType, recipeId: string): void {
    this.weekPlanSignal.update(plan => {
      const newPlan = { ...plan };
      newPlan.days[day].meals[mealType] = recipeId;
      this.saveToStorage(newPlan);
      return newPlan;
    });
  }

  removeMeal(day: DayOfWeek, mealType: MealType): void {
    this.weekPlanSignal.update(plan => {
      const newPlan = { ...plan };
      newPlan.days[day].meals[mealType] = null;
      this.saveToStorage(newPlan);
      return newPlan;
    });
  }

  getDayNutrition(day: DayOfWeek): NutritionInfo {
    const plan = this.weekPlanSignal();
    const dayPlan = plan.days[day];
    const recipeIds = Object.values(dayPlan.meals).filter(id => id !== null) as string[];
    
    return recipeIds.reduce((total, recipeId) => {
      const recipe = this.recipeService.getRecipeById(recipeId);
      if (!recipe) return total;
      
      return {
        calories: total.calories + recipe.nutrition.calories,
        protein: total.protein + recipe.nutrition.protein,
        carbohydrates: total.carbohydrates + recipe.nutrition.carbohydrates,
        fats: total.fats + recipe.nutrition.fats,
        fiber: total.fiber + recipe.nutrition.fiber
      };
    }, { calories: 0, protein: 0, carbohydrates: 0, fats: 0, fiber: 0 });
  }

  clearWeek(): void {
    this.weekPlanSignal.set(this.initWeekPlan());
    localStorage.removeItem('smart-meal-plan');
  }

  private saveToStorage(plan: WeekPlan): void {
    const serialized = {
      weekStart: plan.weekStart.toISOString(),
      days: Object.entries(plan.days).map(([day, dayPlan]) => [
        day,
        { ...dayPlan, date: dayPlan.date.toISOString() }
      ])
    };
    localStorage.setItem('smart-meal-plan', JSON.stringify(serialized));
  }

  private loadFromStorage(): void {
    const stored = localStorage.getItem('smart-meal-plan');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      const weekStart = new Date(parsed.weekStart);
      const currentMonday = this.getMonday(new Date());

      if (weekStart.getTime() !== currentMonday.getTime()) {
        return; // Old plan, don't load
      }

      const days: Record<string, DayPlan> = {};
      parsed.days.forEach(([day, dayPlan]: [string, any]) => {
        days[day] = {
          ...dayPlan,
          date: new Date(dayPlan.date)
        };
      });

      this.weekPlanSignal.set({ weekStart, days: days as Record<DayOfWeek, DayPlan> });
    } catch (error) {
      console.error('Error loading meal plan', error);
    }
  }
}