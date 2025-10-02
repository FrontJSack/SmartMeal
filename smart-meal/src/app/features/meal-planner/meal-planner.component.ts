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
      <div class="week-navigation">
        <p-button icon="pi pi-chevron-left" 
                  [rounded]="true"
                  [outlined]="true"
                  (onClick)="previousWeek()"
                  pTooltip="Poprzedni tydzień"></p-button>
        
        <div class="week-display">
          <h2 class="week-title">{{ getWeekRangeDisplay() }}</h2>
          <p-button label="Bieżący tydzień" 
                    icon="pi pi-calendar"
                    [outlined]="true"
                    size="small"
                    (onClick)="goToCurrentWeek()"></p-button>
        </div>

        <p-button icon="pi pi-chevron-right" 
                  [rounded]="true"
                  [outlined]="true"
                  (onClick)="nextWeek()"
                  pTooltip="Następny tydzień"></p-button>
      </div>

      <div class="planner-header">
        <h1 class="page-title">Planer Posiłków</h1>
          <div class="action-buttons">
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
              <div class="stat-label">Kalorie na tydzień</div>
              <div class="stat-value">{{ getWeeklyCalories() }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Białko w posiłkach (g)</div>
              <div class="stat-value">{{ getWeeklyProtein() }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Średnia kalorii dziennie</div>
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
                (addToPlan)="selectRecipe($event)"
                (viewDetails)="viewRecipeDetails($event)"></app-recipe-card>
      </div>

      <div *ngIf="getFilteredRecipes().length === 0" class="empty-state">
        <p>Brak przepisów dla wybranego typu posiłku</p>
      </div>
    </p-dialog>
  `,
  styles: [`
  .planner-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    gap: 2rem;
  }

  .page-title {
    margin: 0;
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    flex-shrink: 0;
  }

  /* Make action buttons more prominent */
  :host ::ng-deep .action-buttons .p-button {
    padding: 1rem 1.75rem;
    font-size: 1rem;
    font-weight: 600;
    white-space: nowrap;
    border-radius: 12px;
  }

  :host ::ng-deep .action-buttons .p-button .p-button-icon {
    font-size: 1.125rem;
  }

  /* Mobile responsive */
  @media (max-width: 768px) {
    .planner-header {
      flex-direction: column;
      align-items: stretch;
      gap: 1rem;
    }

    .action-buttons {
      flex-direction: column;
      width: 100%;
    }

    :host ::ng-deep .action-buttons .p-button {
      width: 100%;
      justify-content: center;
    }
  }

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
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
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
    border-radius: 16px;
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

  .week-navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding: 1.5rem 2rem;
    background: var(--surface-card);
    border-radius: 16px;
    border: 1px solid var(--surface-border);
    gap: 2rem;
  }

  .week-display {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
  }

  .week-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-color);
    margin: 0;
    text-align: center;
  }

  :host ::ng-deep .week-navigation .p-button.p-button-rounded {
    width: 3rem;
    height: 3rem;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .week-navigation {
      padding: 1rem;
      gap: 1rem;
    }

    .week-title {
      font-size: 1rem;
    }

    :host ::ng-deep .week-navigation .p-button.p-button-rounded {
      width: 2.5rem;
      height: 2.5rem;
    }

    :host ::ng-deep .week-navigation .p-button:not(.p-button-rounded) {
      font-size: 0.8rem;
      padding: 0.5rem 0.75rem;
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

    // Add to component class:
  getWeekRangeDisplay(): string {
    const weekStart = this.mealPlannerService.selectedWeekStart();
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const startStr = weekStart.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long' });
    const endStr = weekEnd.toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
    
    return `${startStr} - ${endStr}`;
  }

  previousWeek(): void {
    this.mealPlannerService.previousWeek();
  }

  nextWeek(): void {
    this.mealPlannerService.nextWeek();
  }

  goToCurrentWeek(): void {
    this.mealPlannerService.goToCurrentWeek();
  }

  viewRecipeDetails(recipe: Recipe): void {
  this.router.navigate(['/recipes', recipe.id]);
  }
}