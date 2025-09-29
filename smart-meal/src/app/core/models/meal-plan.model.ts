import { MealType } from './recipe.model';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DayPlan {
  date: Date;
  meals: Record<MealType, string | null>;
}

export interface WeekPlan {
  weekStart: Date;
  days: Record<DayOfWeek, DayPlan>;
}