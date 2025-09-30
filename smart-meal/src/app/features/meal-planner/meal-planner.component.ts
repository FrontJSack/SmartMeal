import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { MealPlannerService } from '../../core/services/meal-planner.service';
import { RecipeService } from '../../core/services/recipe.service';
import { DayOfWeek, DayPlan } from '../../core/models/meal-plan.model';
import { Recipe, MealType } from '../../core/models/recipe.model';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';

@Component({
  selector: 'app-meal-planner',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    DialogModule,
    DividerModule,
    RecipeCardComponent
  ],
  template: `
    <div>
      <div class="flex justify-between align-center mb-4">
        <h1 class="page-title">Planer Posiłków</h1>
        <div class="flex gap-2">
          <p-button label="Wyczyść tydzień" 
                    icon="pi pi-trash" 
                    severity="danger"
                    [outlined]="true"
                    (onClick)="clearWeek()"></p-button>
          <p-button label="Zobacz listę zakupów" 
                    icon="pi pi-shopping-cart"
                    (onClick)="goToShopping()"></p-button>
        </div>
      </div>

      <div class="week-summary mb-4">
        <p-card>
          <div class="grid" style="grid-template-columns: repeat(4, 1fr); gap: 1rem;">
            <div class="stat-card">
              <div class="stat-label">Zaplanowanych posiłków</div>
              <div class="stat-value">{{ getMealCount() }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Kalorie tygodniowo</div>
              <div class="stat-value">{{ getWeeklyCalories() }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Białko (g)</div>
              <div class="stat-value">{{ getWeeklyProtein() }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Średnio dziennie</div>
              <div class="stat-value">{{ getAverageDailyCalories() }}</div>
            </div>
          </div>
        </p-card>
      </div>

      <div class="days-grid">
        <div *ngFor="let day of days" class="day-card">
          <p-card>
            <ng-template pTemplate="header">
              <div class="day-header">
                <h3>{{ getDayLabel(day) }}</h3>
                <span class="day-date">{{ getDayDate(day) }}</span>
              </div>
            </ng-template>

            <div class="meals-container">
              <div *ngFor="let mealType of mealTypes" class="meal-slot">
                <div class="meal-slot-header">
                  <i [class]="getMealIcon(mealType)"></i>
                  <span>{{ getMealLabel(mealType) }}</span>
                </div>

                <div *ngIf="getMeal(day, mealType) as recipe; else emptySlot" 
                     class="meal-content">
                  <div class="meal-recipe">
                    <div class="meal-recipe-info">
                      <div class="meal-recipe-name">{{ recipe.name }}</div>
                      <div class="meal-recipe-calories">{{ recipe.nutrition.calories }} kcal</div>
                    </div>
                    <p-button icon="pi pi-times" 
                              [rounded]="true"
                              [text]="true"
                              severity="danger"
                              (onClick)="removeMeal(day, mealType)"></p-button>
                  </div>
                </div>

                <ng-template #emptySlot>
                  <div class="empty-meal-slot">
                    <p-button label="Dodaj posiłek" 
                              icon="pi pi-plus"
                              [outlined]="true"
                              size="small"
                              (onClick)="openRecipeSelector(day, mealType)"></p-button>
                  </div>
                </ng-template>
              </div>

              <p-divider></p-divider>

              <div class="day-nutrition">
                <div class="nutrition-summary">
                  <span class="nutrition-summary-label">Dzienny bilans:</span>
                  <span class="nutrition-summary-value">
                    {{ getDayCalories(day) }} kcal
                  </span>
                </div>
              </div>
            </div>
          </p-card>
        </div>
      </div>
    </div>

    <p-dialog [header]="'Wybierz przepis na ' + getMealLabel(selectedMealType())"
              [(visible)]="showRecipeDialog"
              [modal]="true"
              [style]="{'width': '80vw', 'max-width': '1200px'}"
              [closable]="true">
      <div class="recipe-selector-grid">
        <app-recipe-card *ngFor="let recipe of getFilteredRecipes()"
                        [recipe]="recipe"
                        [showAddButton]="true"
                        (addToPlan)="selectRecipe($event)"></app-recipe-card>
      </div>

      <div *ngIf="getFilteredRecipes().length === 0" class="empty-state">
        <p>Brak przepisów dla wybranego typu posiłku</p>
      </div>
    </p-dialog>
  `,
  styles: [`
  .week-summary {
    margin-bottom: 2rem;
  }

  :host ::ng-deep .week-summary .p-card {
    background: transparent !important;
    border: none !important;
    box-shadow: none !important;
  }

  :host ::ng-deep .week-summary .p-card-body {
    padding: 0 !important;
  }

  .days-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  :host ::ng-deep .day-card .p-card {
    background: var(--surface-card) !important;
    border: 1px solid var(--surface-border) !important;
    height: 100%;
  }

  :host ::ng-deep .day-card .p-card-header {
    background: var(--surface-section) !important;
    padding: 1rem 1.5rem !important;
    border-bottom: 1px solid var(--surface-border) !important;
  }

  :host ::ng-deep .day-card .p-card-body {
    padding: 1.5rem !important;
    background: var(--surface-card) !important;
  }

  .day-header {
    text-align: center;
  }

  .day-header h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--text-color);
  }

  .day-date {
    color: var(--text-color-secondary);
    font-size: 0.875rem;
  }

  .meals-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .meal-slot {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .meal-slot-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: var(--text-color-secondary);
    font-size: 0.875rem;
  }

  .meal-slot-header i {
    color: var(--primary-500);
  }

  .meal-content {
    background: var(--surface-overlay);
    border-radius: 8px;
    padding: 1rem;
    border: 1px solid var(--surface-border);
  }

  .meal-recipe {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .meal-recipe-info {
    flex: 1;
    min-width: 0;
  }

  .meal-recipe-name {
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 0.25rem;
  }

  .meal-recipe-calories {
    font-size: 0.875rem;
    color: var(--text-color-secondary);
  }

  .empty-meal-slot {
    display: flex;
    justify-content: center;
    padding: 1rem;
    border: 2px dashed var(--surface-border);
    border-radius: 8px;
    background: var(--surface-section);
  }

  :host ::ng-deep .empty-meal-slot .p-button {
    width: 100%;
  }

  .day-nutrition {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--surface-border);
  }

  .nutrition-summary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.875rem 1rem;
    background: var(--surface-overlay);
    border-radius: 8px;
    border: 1px solid var(--surface-border);
  }

  .nutrition-summary-label {
    font-weight: 600;
    color: var(--text-color-secondary);
    font-size: 0.875rem;
  }

  .nutrition-summary-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--primary-500);
  }

  .recipe-selector-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
    max-height: 60vh;
    overflow-y: auto;
    padding: 1rem 0;
  }

  :host ::ng-deep .p-dialog .p-dialog-header {
    background: var(--surface-section) !important;
    color: var(--text-color) !important;
  }

  :host ::ng-deep .p-dialog .p-dialog-content {
    background: var(--surface-card) !important;
  }

  @media (max-width: 768px) {
    .days-grid {
      grid-template-columns: 1fr;
    }

    .recipe-selector-grid {
      grid-template-columns: 1fr;
    }
  }
  `]
})
export class MealPlannerComponent {
  private mealPlannerService = inject(MealPlannerService);
  private recipeService = inject(RecipeService);
  private router = inject(Router);

  days: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  mealTypes: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  showRecipeDialog = false;
  selectedDay = signal<DayOfWeek>('monday');
  selectedMealType = signal<MealType>('breakfast');

  getDayLabel(day: DayOfWeek): string {
    const labels: Record<DayOfWeek, string> = {
      monday: 'Poniedziałek',
      tuesday: 'Wtorek',
      wednesday: 'Środa',
      thursday: 'Czwartek',
      friday: 'Piątek',
      saturday: 'Sobota',
      sunday: 'Niedziela'
    };
    return labels[day];
  }

  getDayDate(day: DayOfWeek): string {
    const plan = this.mealPlannerService.weekPlan();
    const dayPlan = plan.days[day];
    return dayPlan.date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
  }

  getMealLabel(mealType: MealType): string {
    const labels: Record<MealType, string> = {
      breakfast: 'Śniadanie',
      lunch: 'Lunch',
      dinner: 'Obiad',
      snack: 'Przekąska'
    };
    return labels[mealType];
  }

  getMealIcon(mealType: MealType): string {
    const icons: Record<MealType, string> = {
      breakfast: 'pi pi-sun',
      lunch: 'pi pi-clock',
      dinner: 'pi pi-moon',
      snack: 'pi pi-star'
    };
    return icons[mealType];
  }

  getMeal(day: DayOfWeek, mealType: MealType): Recipe | undefined {
    const plan = this.mealPlannerService.weekPlan();
    const recipeId = plan.days[day].meals[mealType];
    return recipeId ? this.recipeService.getRecipeById(recipeId) : undefined;
  }

  getDayCalories(day: DayOfWeek): number {
    const nutrition = this.mealPlannerService.getDayNutrition(day);
    return nutrition.calories;
  }

  getMealCount(): number {
    const plan = this.mealPlannerService.weekPlan();
    let count = 0;
    this.days.forEach(day => {
      this.mealTypes.forEach(mealType => {
        if (plan.days[day].meals[mealType]) count++;
      });
    });
    return count;
  }

  getWeeklyCalories(): number {
    let total = 0;
    this.days.forEach(day => {
      total += this.getDayCalories(day);
    });
    return total;
  }

  getWeeklyProtein(): number {
    let total = 0;
    this.days.forEach(day => {
      const nutrition = this.mealPlannerService.getDayNutrition(day);
      total += nutrition.protein;
    });
    return Math.round(total);
  }

  getAverageDailyCalories(): number {
    const mealCount = this.getMealCount();
    if (mealCount === 0) return 0;
    return Math.round(this.getWeeklyCalories() / 7);
  }

  openRecipeSelector(day: DayOfWeek, mealType: MealType): void {
    this.selectedDay.set(day);
    this.selectedMealType.set(mealType);
    this.showRecipeDialog = true;
  }

  getFilteredRecipes(): Recipe[] {
    const mealType = this.selectedMealType();
    return this.recipeService.recipes().filter(recipe => 
      recipe.mealTypes.includes(mealType)
    );
  }

  selectRecipe(recipe: Recipe): void {
    this.mealPlannerService.addMeal(this.selectedDay(), this.selectedMealType(), recipe.id);
    this.showRecipeDialog = false;
  }

  removeMeal(day: DayOfWeek, mealType: MealType): void {
    this.mealPlannerService.removeMeal(day, mealType);
  }

  clearWeek(): void {
    if (confirm('Czy na pewno chcesz wyczyścić cały tydzień?')) {
      this.mealPlannerService.clearWeek();
    }
  }

  goToShopping(): void {
    this.router.navigate(['/shopping']);
  }
}