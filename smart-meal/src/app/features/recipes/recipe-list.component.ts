import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';
import { RecipeService } from '../../core/services/recipe.service';
import { RecipeCardComponent } from '../../shared/components/recipe-card/recipe-card.component';
import { Recipe, MealType, DietaryTag } from '../../core/models/recipe.model';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    MultiSelectModule,
    ButtonModule,
    RecipeCardComponent
  ],
  template: `
    <div>
      <div class="header-section">
        <h1 class="page-title">Przepisy</h1>
        <p-button 
          label="Wyczyść filtry" 
          icon="pi pi-filter-slash"
          [outlined]="true"
          (onClick)="clearFilters()"
          styleClass="clear-filters-btn">
        </p-button>
      </div>

      <div class="filter-card">
        <div class="filter-grid">
          <div class="search-wrapper">
            <span class="p-input-icon-left">
              <i class="pi pi-search"></i>
              <input 
                type="text" 
                pInputText 
                placeholder="Szukaj przepisu..."
                [(ngModel)]="searchTerm"
                (ngModelChange)="onSearchChange($event)"
                class="search-input" />
            </span>
          </div>

          <div class="filter-wrapper">
            <label class="filter-label">Typ posiłku</label>
            <p-multiSelect 
              [options]="mealTypeOptions"
              [(ngModel)]="selectedMealTypes"
              (ngModelChange)="onMealTypesChange($event)"
              placeholder="Wybierz typ"
              [showClear]="true"
              styleClass="custom-multiselect">
            </p-multiSelect>
          </div>

          <div class="filter-wrapper">
            <label class="filter-label">Dieta</label>
            <p-multiSelect 
              [options]="dietaryTagOptions"
              [(ngModel)]="selectedDietaryTags"
              (ngModelChange)="onDietaryTagsChange($event)"
              placeholder="Wybierz dietę"
              [showClear]="true"
              styleClass="custom-multiselect">
            </p-multiSelect>
          </div>
        </div>
      </div>

      <div class="results-info">
        <i class="pi pi-list"></i>
        <span>Znaleziono <strong>{{ recipeService.filteredRecipes().length }}</strong> przepisów</span>
      </div>

      <div class="recipes-grid">
        <app-recipe-card 
          *ngFor="let recipe of recipeService.filteredRecipes()"
          [recipe]="recipe"
          [showAddButton]="false"
          (viewDetails)="viewRecipe($event)">
        </app-recipe-card>
      </div>

      <div *ngIf="recipeService.filteredRecipes().length === 0" class="empty-state">
        <i class="pi pi-inbox"></i>
        <h3>Brak wyników</h3>
        <p>Nie znaleziono przepisów spełniających kryteria</p>
        <p-button 
          label="Wyczyść filtry" 
          icon="pi pi-refresh"
          (onClick)="clearFilters()">
        </p-button>
      </div>
    </div>
  `,
  styles: [`
    /* Header Section */
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      gap: 1rem;
    }

    .page-title {
      margin: 0;
    }

    /* Filter Card */
    .filter-card {
      background: var(--surface-card);
      border: 1px solid var(--surface-border);
      border-radius: 16px;
      padding: 2rem;
      margin-bottom: 2rem;
      box-shadow: var(--shadow-sm);
    }

    .filter-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 1.5rem;
      align-items: end;
    }

    /* Search Input */
    .search-wrapper {
      width: 100%;
    }

    :host ::ng-deep .search-input {
      width: 100%;
      padding: 0.875rem 1.25rem 0.875rem 3rem;
      font-size: 1rem;
      border: 2px solid var(--surface-border);
      border-radius: 12px;
      background: var(--surface-section);
      color: var(--text-color);
      transition: all 0.2s;
    }

    :host ::ng-deep .search-input:focus {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
      outline: none;
    }

    :host ::ng-deep .p-input-icon-left > i {
      left: 1rem;
      color: var(--text-color-secondary);
      font-size: 1.125rem;
    }

    /* Filter Wrappers */
    .filter-wrapper {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .filter-label {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-color-secondary);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* MultiSelect Styling */
    :host ::ng-deep .custom-multiselect {
      width: 100%;
    }

    :host ::ng-deep .custom-multiselect .p-multiselect {
      width: 100%;
      border: 2px solid var(--surface-border);
      border-radius: 12px;
      background: var(--surface-section);
      transition: all 0.2s;
    }

    :host ::ng-deep .custom-multiselect .p-multiselect:not(.p-disabled):hover {
      border-color: var(--primary-500);
    }

    :host ::ng-deep .custom-multiselect .p-multiselect:not(.p-disabled).p-focus {
      border-color: var(--primary-500);
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
    }

    :host ::ng-deep .custom-multiselect .p-multiselect-label {
      padding: 0.875rem 1.25rem;
      color: var(--text-color);
      font-size: 1rem;
    }

    :host ::ng-deep .custom-multiselect .p-multiselect-label.p-placeholder {
      color: var(--text-color-secondary);
    }

    :host ::ng-deep .custom-multiselect .p-multiselect-trigger {
      width: 3rem;
      color: var(--text-color-secondary);
    }

    /* MultiSelect Panel - With Backdrop Overlay */
    :host ::ng-deep .p-component-overlay {
      background: rgba(0, 0, 0, 0.6) !important;
      z-index: 1000 !important;
    }

    :host ::ng-deep .p-multiselect-panel {
      background: var(--surface-ground) !important;
      border: 3px solid var(--primary-500) !important;
      border-radius: 20px !important;
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.8) !important;
      margin-top: 0.5rem !important;
      z-index: 1001 !important;
      padding: 0.5rem !important;
    }

    :host ::ng-deep .p-multiselect-panel .p-multiselect-header {
      background: var(--surface-card) !important;
      border-bottom: 2px solid var(--primary-500) !important;
      padding: 1.5rem 1.75rem !important;
      border-radius: 16px 16px 0 0 !important;
      margin-bottom: 0.5rem !important;
    }

    :host ::ng-deep .p-multiselect-panel .p-multiselect-filter-container {
      padding: 0.75rem 0.5rem !important;
    }

    :host ::ng-deep .p-multiselect-panel .p-multiselect-filter {
      padding: 0.875rem 1.125rem !important;
      border: 2px solid var(--surface-border) !important;
      border-radius: 12px !important;
      background: var(--surface-section) !important;
      color: var(--text-color) !important;
      font-size: 1rem !important;
    }

    :host ::ng-deep .p-multiselect-panel .p-multiselect-filter:focus {
      border-color: var(--primary-500) !important;
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.2) !important;
    }

    :host ::ng-deep .p-multiselect-panel .p-multiselect-items-wrapper {
      background: var(--surface-ground) !important;
      border-radius: 12px !important;
      padding: 0.5rem !important;
    }

    :host ::ng-deep .p-multiselect-panel .p-multiselect-items {
      padding: 0.5rem !important;
      background: var(--surface-ground) !important;
    }

    :host ::ng-deep .p-multiselect-panel .p-multiselect-item {
      padding: 1.25rem 1.75rem !important;
      margin: 0.5rem 0 !important;
      border-radius: 14px !important;
      color: var(--text-color) !important;
      transition: all 0.2s !important;
      background: var(--surface-card) !important;
      border: 2px solid var(--surface-border) !important;
      font-size: 1rem !important;
    }

    :host ::ng-deep .p-multiselect-panel .p-multiselect-item:hover {
      background: var(--surface-hover) !important;
      border-color: var(--primary-500) !important;
      transform: translateX(4px) !important;
    }

    :host ::ng-deep .p-multiselect-panel .p-multiselect-item.p-highlight {
      background: var(--primary-600) !important;
      color: white !important;
      border-color: var(--primary-600) !important;
      font-weight: 600 !important;
      box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3) !important;
    }

    :host ::ng-deep .p-multiselect-panel .p-checkbox {
      margin-right: 1rem !important;
    }

    :host ::ng-deep .p-multiselect-panel .p-checkbox .p-checkbox-box {
      width: 1.5rem !important;
      height: 1.5rem !important;
      border: 2px solid var(--surface-border) !important;
      border-radius: 8px !important;
      background: var(--surface-section) !important;
      transition: all 0.2s !important;
    }

    :host ::ng-deep .p-multiselect-panel .p-checkbox .p-checkbox-box.p-highlight {
      background: var(--primary-600) !important;
      border-color: var(--primary-600) !important;
    }

    :host ::ng-deep .p-multiselect-panel .p-checkbox .p-checkbox-box .p-checkbox-icon {
      font-size: 1rem !important;
      font-weight: 700 !important;
    }

    /* Close button styling */
    :host ::ng-deep .p-multiselect-panel .p-multiselect-close {
      color: var(--text-color) !important;
      width: 2.25rem !important;
      height: 2.25rem !important;
      border-radius: 10px !important;
      transition: all 0.2s !important;
    }

    :host ::ng-deep .p-multiselect-panel .p-multiselect-close:hover {
      background: var(--surface-hover) !important;
      color: var(--primary-500) !important;
    }

    /* Clear Filters Button - Match Detail Page Style */
    :host ::ng-deep .header-section .p-button {
      padding: 0.875rem 1.75rem !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      border-radius: 12px !important;
      border: 2px solid var(--surface-border) !important;
      background: transparent !important;
      color: var(--text-color) !important;
      transition: all 0.2s !important;
      white-space: nowrap !important;
    }

    :host ::ng-deep .header-section .p-button:hover {
      border-color: var(--primary-500) !important;
      color: var(--primary-500) !important;
      background: rgba(34, 197, 94, 0.05) !important;
      transform: translateY(-2px) !important;
    }

    /* Recipe Card Button Styling */
    :host ::ng-deep .recipes-grid app-recipe-card .p-button {
      width: 100%;
      padding: 1rem 1.75rem !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      border-radius: 12px !important;
      transition: all 0.2s !important;
    }

    :host ::ng-deep .recipes-grid app-recipe-card .p-button.p-button-outlined {
      border: 2px solid var(--surface-border) !important;
      background: transparent !important;
      color: var(--text-color) !important;
    }

    :host ::ng-deep .recipes-grid app-recipe-card .p-button.p-button-outlined:hover {
      border-color: var(--primary-500) !important;
      color: var(--primary-500) !important;
      background: rgba(34, 197, 94, 0.05) !important;
      transform: translateY(-2px) !important;
    }

    /* Recipe Card Improvements */
    :host ::ng-deep .recipes-grid app-recipe-card .p-card {
      transition: all 0.2s;
    }

    :host ::ng-deep .recipes-grid app-recipe-card .p-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    }

    /* Results Info */
    .results-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      padding: 1rem 1.5rem;
      background: var(--surface-section);
      border-radius: 12px;
      border: 1px solid var(--surface-border);
      color: var(--text-color-secondary);
      font-size: 0.9375rem;
    }

    .results-info i {
      color: var(--primary-500);
      font-size: 1.125rem;
    }

    .results-info strong {
      color: var(--primary-500);
      font-weight: 700;
    }

    /* Recipes Grid */
    .recipes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--surface-card);
      border: 2px dashed var(--surface-border);
      border-radius: 16px;
      margin-top: 2rem;
    }

    .empty-state i {
      font-size: 3.5rem;
      color: var(--text-color-light);
      opacity: 0.5;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 0.5rem 0;
      font-size: 1.25rem;
      color: var(--text-color);
    }

    .empty-state p {
      color: var(--text-color-secondary);
      margin-bottom: 1.5rem;
    }

    /* Mobile Responsive */
    @media (max-width: 992px) {
      .filter-grid {
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .search-wrapper {
        grid-column: 1 / -1;
      }
    }

    @media (max-width: 768px) {
      .header-section {
        flex-direction: column;
        align-items: stretch;
      }

      :host ::ng-deep .clear-filters-btn .p-button {
        width: 100%;
        justify-content: center;
      }

      .filter-card {
        padding: 1.5rem;
      }

      .filter-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }

      .recipes-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RecipeListComponent {
  recipeService = inject(RecipeService);
  private router = inject(Router);

  searchTerm = '';
  selectedMealTypes: string[] = [];
  selectedDietaryTags: string[] = [];

  mealTypeOptions: SelectOption[] = [
    { label: 'Śniadanie', value: 'breakfast' },
    { label: 'Lunch', value: 'lunch' },
    { label: 'Obiad', value: 'dinner' },
    { label: 'Przekąska', value: 'snack' }
  ];

  dietaryTagOptions: SelectOption[] = [
    { label: 'Wegetariańskie', value: 'vegetarian' },
    { label: 'Wegańskie', value: 'vegan' },
    { label: 'Bezglutenowe', value: 'gluten-free' },
    { label: 'Bez laktozy', value: 'dairy-free' }
  ];

  onSearchChange(term: string): void {
    this.recipeService.setSearchTerm(term);
  }

  onMealTypesChange(types: string[]): void {
    this.recipeService.setMealTypes(types as MealType[]);
  }

  onDietaryTagsChange(tags: string[]): void {
    this.recipeService.setDietaryTags(tags as DietaryTag[]);
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedMealTypes = [];
    this.selectedDietaryTags = [];
    this.recipeService.clearFilters();
  }

  viewRecipe(recipe: Recipe): void {
    this.router.navigate(['/recipes', recipe.id]);
  }
}