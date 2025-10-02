import { Injectable, signal, computed } from '@angular/core';
import { DayOfWeek, WeekPlan, DayPlan } from '../models/meal-plan.model';
import { MealType, Recipe } from '../models/recipe.model';
import { NutritionInfo } from '../models/recipe.model';
import { RecipeService } from './recipe.service';

@Injectable({
  providedIn: 'root'
})
export class MealPlannerService {
  // Track which week we're currently viewing
  private selectedWeekStartSignal = signal<Date>(this.getCurrentMonday());
  
  // Store all week plans
  private allWeekPlansSignal = signal<Record<string, WeekPlan>>({});
  
  // Computed: current week plan based on selected week
  weekPlan = computed(() => {
    const weekKey = this.getWeekKey(this.selectedWeekStartSignal());
    const allPlans = this.allWeekPlansSignal();
    
    if (!allPlans[weekKey]) {
      // Create new plan for this week if it doesn't exist
      return this.createWeekPlan(this.selectedWeekStartSignal());
    }
    
    return allPlans[weekKey];
  });

  selectedWeekStart = this.selectedWeekStartSignal.asReadonly();

  constructor(private recipeService: RecipeService) {
    this.loadAllFromStorage();
  }

  private getCurrentMonday(): Date {
    return this.getMonday(new Date());
  }

  private getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    d.setDate(diff);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private getWeekKey(date: Date): string {
    const monday = this.getMonday(date);
    return monday.toISOString().split('T')[0]; // YYYY-MM-DD format
  }

  private createWeekPlan(weekStart: Date): WeekPlan {
    const days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    const plan: WeekPlan = {
      weekStart: new Date(weekStart),
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

  // Navigate to next week
  nextWeek(): void {
    const current = this.selectedWeekStartSignal();
    const next = new Date(current);
    next.setDate(current.getDate() + 7);
    this.selectedWeekStartSignal.set(next);
  }

  // Navigate to previous week
  previousWeek(): void {
    const current = this.selectedWeekStartSignal();
    const previous = new Date(current);
    previous.setDate(current.getDate() - 7);
    this.selectedWeekStartSignal.set(previous);
  }

  // Jump to current week
  goToCurrentWeek(): void {
    this.selectedWeekStartSignal.set(this.getCurrentMonday());
  }

  // Jump to specific week
  goToWeek(date: Date): void {
    this.selectedWeekStartSignal.set(this.getMonday(date));
  }

  addMeal(day: DayOfWeek, mealType: MealType, recipeId: string): void {
    const weekKey = this.getWeekKey(this.selectedWeekStartSignal());
    const currentPlan = this.weekPlan();
    
    const updatedPlan = {
      ...currentPlan,
      days: {
        ...currentPlan.days,
        [day]: {
          ...currentPlan.days[day],
          meals: {
            ...currentPlan.days[day].meals,
            [mealType]: recipeId
          }
        }
      }
    };

    this.allWeekPlansSignal.update(plans => ({
      ...plans,
      [weekKey]: updatedPlan
    }));

    this.saveAllToStorage();
  }

  removeMeal(day: DayOfWeek, mealType: MealType): void {
    const weekKey = this.getWeekKey(this.selectedWeekStartSignal());
    const currentPlan = this.weekPlan();
    
    const updatedPlan = {
      ...currentPlan,
      days: {
        ...currentPlan.days,
        [day]: {
          ...currentPlan.days[day],
          meals: {
            ...currentPlan.days[day].meals,
            [mealType]: null
          }
        }
      }
    };

    this.allWeekPlansSignal.update(plans => ({
      ...plans,
      [weekKey]: updatedPlan
    }));

    this.saveAllToStorage();
  }

  getDayNutrition(day: DayOfWeek): NutritionInfo {
    const plan = this.weekPlan();
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
    const weekKey = this.getWeekKey(this.selectedWeekStartSignal());
    const emptyPlan = this.createWeekPlan(this.selectedWeekStartSignal());
    
    this.allWeekPlansSignal.update(plans => ({
      ...plans,
      [weekKey]: emptyPlan
    }));

    this.saveAllToStorage();
  }

  private saveAllToStorage(): void {
    const plans = this.allWeekPlansSignal();
    const serialized: Record<string, any> = {};

    Object.entries(plans).forEach(([weekKey, plan]) => {
      serialized[weekKey] = {
        weekStart: plan.weekStart.toISOString(),
        days: Object.entries(plan.days).reduce((acc, [day, dayPlan]) => {
          acc[day] = {
            ...dayPlan,
            date: dayPlan.date.toISOString()
          };
          return acc;
        }, {} as Record<string, any>)
      };
    });

    localStorage.setItem('smart-meal-plans', JSON.stringify(serialized));
  }

  private loadAllFromStorage(): void {
    const stored = localStorage.getItem('smart-meal-plans');
    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      const loadedPlans: Record<string, WeekPlan> = {};

      Object.entries(parsed).forEach(([weekKey, planData]: [string, any]) => {
        const days: Record<string, DayPlan> = {};
        
        Object.entries(planData.days).forEach(([day, dayPlan]: [string, any]) => {
          days[day] = {
            ...dayPlan,
            date: new Date(dayPlan.date)
          };
        });

        loadedPlans[weekKey] = {
          weekStart: new Date(planData.weekStart),
          days: days as Record<DayOfWeek, DayPlan>
        };
      });

      this.allWeekPlansSignal.set(loadedPlans);
    } catch (error) {
      console.error('Error loading meal plans', error);
    }
  }
}