import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'planner',
    pathMatch: 'full'
  },
  {
    path: 'planner',
    loadComponent: () => import('./features/meal-planner/meal-planner.component').then(m => m.MealPlannerComponent)
  },
  {
    path: 'recipes',
    loadComponent: () => import('./features/recipes/recipe-list.component').then(m => m.RecipeListComponent)
  },
  {
    path: 'recipes/:id',
    loadComponent: () => import('./features/recipes/recipe-detail.component').then(m => m.RecipeDetailComponent)
  },
  {
    path: 'shopping',
    loadComponent: () => import('./features/shopping-list/shopping-list.component').then(m => m.ShoppingListComponent)
  },
  {
    path: 'weight',
    loadComponent: () => import('./features/weight-tracker/weight-tracker.component').then(m => m.WeightTrackerComponent)
  },
  {
    path: 'stats',
    loadComponent: () => import('./features/statistics/statistics.component').then(m => m.StatisticsComponent)
  }
];