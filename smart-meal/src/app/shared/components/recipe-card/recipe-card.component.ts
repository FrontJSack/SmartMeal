import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Recipe } from '../../../core/models/recipe.model';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TagModule],
  template: `
    <p-card [style]="{'height': '100%'}">
      <ng-template pTemplate="header">
        <img [alt]="recipe.name" [src]="recipe.imageUrl" 
             style="width: 100%; height: 200px; object-fit: cover;" />
      </ng-template>

      <div class="card-content">
        <h3 class="recipe-title">{{ recipe.name }}</h3>
        <p class="recipe-description">{{ recipe.description }}</p>

        <div class="flex gap-2 mb-3">
          <p-tag [value]="getDifficultyLabel()" [severity]="getDifficultySeverity()"></p-tag>
          <p-tag *ngFor="let tag of recipe.dietaryTags.slice(0, 2)" 
                 [value]="getDietaryLabel(tag)" 
                 severity="success"></p-tag>
        </div>

        <div class="recipe-meta mb-3">
          <div class="flex align-center gap-2">
            <i class="pi pi-clock"></i>
            <span>{{ getTotalTime() }} min</span>
          </div>
          <div class="flex align-center gap-2">
            <i class="pi pi-users"></i>
            <span>{{ recipe.servings }} porcji</span>
          </div>
        </div>

        <div class="nutrition-grid">
          <div class="nutrition-item">
            <div class="nutrition-value">{{ recipe.nutrition.calories }}</div>
            <div class="nutrition-label">kcal</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">{{ recipe.nutrition.protein }}g</div>
            <div class="nutrition-label">Białko</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">{{ recipe.nutrition.carbohydrates }}g</div>
            <div class="nutrition-label">Węgl.</div>
          </div>
          <div class="nutrition-item">
            <div class="nutrition-value">{{ recipe.nutrition.fats }}g</div>
            <div class="nutrition-label">Tłuszcze</div>
          </div>
        </div>
      </div>

      <ng-template pTemplate="footer">
        <div class="flex gap-2">
          <p-button label="Szczegóły" 
                    icon="pi pi-info-circle" 
                    [outlined]="true"
                    (onClick)="viewDetails.emit(recipe)"
                    styleClass="flex-1"></p-button>
          <p-button *ngIf="showAddButton"
                    label="Dodaj" 
                    icon="pi pi-plus" 
                    (onClick)="addToPlan.emit(recipe)"
                    styleClass="flex-1"></p-button>
        </div>
      </ng-template>
    </p-card>
  `,
  styles: [`
    .card-content {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .recipe-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 0;
      color: var(--text-color);
    }

    .recipe-description {
      color: var(--text-color-secondary);
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .recipe-meta {
      display: flex;
      gap: 1rem;
      color: var(--text-color-secondary);
      font-size: 0.875rem;
    }

    .nutrition-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.5rem;
      padding: 1rem;
      background: var(--surface-section);
      border-radius: 8px;
    }

    .nutrition-item {
      text-align: center;
    }

    .nutrition-value {
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--primary-color);
    }

    .nutrition-label {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
      margin-top: 0.25rem;
    }

    :host ::ng-deep .flex-1 {
      flex: 1;
    }
  `]
})
export class RecipeCardComponent {
  @Input({ required: true }) recipe!: Recipe;
  @Input() showAddButton = false;
  
  @Output() viewDetails = new EventEmitter<Recipe>();
  @Output() addToPlan = new EventEmitter<Recipe>();

  getTotalTime(): number {
    return this.recipe.prepTime + this.recipe.cookTime;
  }

  getDifficultyLabel(): string {
    const labels: Record<string, string> = {
      'easy': 'Łatwy',
      'medium': 'Średni',
      'hard': 'Trudny'
    };
    return labels[this.recipe.difficulty];
  }

  getDifficultySeverity(): 'success' | 'info' | 'warn' {
    const severities: Record<string, 'success' | 'info' | 'warn'> = {
      'easy': 'success',
      'medium': 'info',
      'hard': 'warn'
    };
    return severities[this.recipe.difficulty];
  }

  getDietaryLabel(tag: string): string {
    const labels: Record<string, string> = {
      'vegetarian': 'Wege',
      'vegan': 'Vegan',
      'gluten-free': 'Bezglutenowe',
      'dairy-free': 'Bez laktozy'
    };
    return labels[tag] || tag;
  }
}