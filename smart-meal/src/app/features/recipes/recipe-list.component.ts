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
      <div class="flex justify-between align-center mb-4">
        <h1 class="page-title">Przepisy</h1>
        <p-button label="Wyczyść filtry" 
                  icon="pi pi-filter-slash"
                  [outlined]="true"
                  (onClick)="clearFilters()"></p-button>
      </div>

      <div class="filter-section mb-4">
        <div class="grid" style="grid-template-columns: 2fr 1fr 1fr; gap: 1rem;">
          <span class="p-input-icon-left" style="width: 100%;">
            <i class="pi pi-search"></i>
            <input type="text" 
                   pInputText 
                   placeholder="Szukaj przepisu..."
                   [(ngModel)]="searchTerm"
                   (ngModelChange)="onSearchChange($event)"
                   style="width: 100%;" />
          </span>

          <p-multiSelect [options]="mealTypeOptions"
                        [(ngModel)]="selectedMealTypes"
                        (ngModelChange)="onMealTypesChange($event)"
                        placeholder="Typ posiłku"
                        [style]="{'width': '100%'}"></p-multiSelect>

          <p-multiSelect [options]="dietaryTagOptions"
                        [(ngModel)]="selectedDietaryTags"
                        (ngModelChange)="onDietaryTagsChange($event)"
                        placeholder="Dieta"
                        [style]="{'width': '100%'}"></p-multiSelect>
        </div>
      </div>

      <div class="results-info mb-3">
        <span>Znaleziono: <strong>{{ recipeService.filteredRecipes().length }}</strong> przepisów</span>
      </div>

      <div class="grid" style="grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem;">
        <app-recipe-card *ngFor="let recipe of recipeService.filteredRecipes()"
                        [recipe]="recipe"
                        [showAddButton]="false"
                        (viewDetails)="viewRecipe($event)"></app-recipe-card>
      </div>

      <div *ngIf="recipeService.filteredRecipes().length === 0" class="empty-state">
        <i class="pi pi-inbox" style="font-size: 3rem; color: var(--text-color-secondary);"></i>
        <p>Nie znaleziono przepisów spełniających kryteria</p>
      </div>
    </div>
  `,
  styles: [`
    .filter-section {
      background: var(--surface-card);
      padding: 1.5rem;
      border-radius: 12px;
    }

    .results-info {
      color: var(--text-color-secondary);
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-color-secondary);
    }

    .empty-state p {
      margin-top: 1rem;
      font-size: 1.125rem;
    }

    @media (max-width: 768px) {
      .filter-section .grid {
        grid-template-columns: 1fr !important;
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