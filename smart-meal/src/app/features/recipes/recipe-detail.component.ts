import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { RecipeService } from '../../core/services/recipe.service';
import { Recipe } from '../../core/models/recipe.model';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TagModule,
    DividerModule
  ],
  template: `
    <div *ngIf="recipe()">
      <div class="mb-3">
        <p-button label="Wróć" 
                  icon="pi pi-arrow-left" 
                  [outlined]="true"
                  (onClick)="goBack()"></p-button>
      </div>

      <div class="grid" style="grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div>
          <img [src]="recipe()!.imageUrl" 
               [alt]="recipe()!.name"
               style="width: 100%; border-radius: 12px; margin-bottom: 1rem;" />
          
          <p-card>
            <h2 style="margin-top: 0;">{{ recipe()!.name }}</h2>
            <p style="color: var(--text-color-secondary); line-height: 1.6;">
              {{ recipe()!.description }}
            </p>

            <div class="flex gap-2 mb-3">
              <p-tag [value]="getDifficultyLabel(recipe()!.difficulty)" 
                     [severity]="getDifficultySeverity(recipe()!.difficulty)"></p-tag>
              <p-tag *ngFor="let tag of recipe()!.dietaryTags" 
                     [value]="getDietaryLabel(tag)" 
                     severity="success"></p-tag>
            </div>

            <div class="recipe-meta-detail">
              <div class="meta-item">
                <i class="pi pi-clock"></i>
                <div>
                  <div class="meta-label">Przygotowanie</div>
                  <div class="meta-value">{{ recipe()!.prepTime }} min</div>
                </div>
              </div>
              <div class="meta-item">
                <i class="pi pi-clock"></i>
                <div>
                  <div class="meta-label">Gotowanie</div>
                  <div class="meta-value">{{ recipe()!.cookTime }} min</div>
                </div>
              </div>
              <div class="meta-item">
                <i class="pi pi-users"></i>
                <div>
                  <div class="meta-label">Porcje</div>
                  <div class="meta-value">{{ recipe()!.servings }}</div>
                </div>
              </div>
            </div>
          </p-card>
        </div>

        <div>
          <p-card>
            <h3 style="margin-top: 0;">Wartości odżywcze</h3>
            <div class="nutrition-detail-grid">
              <div class="nutrition-detail-item">
                <div class="nutrition-detail-value">{{ recipe()!.nutrition.calories }}</div>
                <div class="nutrition-detail-label">Kalorie (kcal)</div>
              </div>
              <div class="nutrition-detail-item">
                <div class="nutrition-detail-value">{{ recipe()!.nutrition.protein }}g</div>
                <div class="nutrition-detail-label">Białko</div>
              </div>
              <div class="nutrition-detail-item">
                <div class="nutrition-detail-value">{{ recipe()!.nutrition.carbohydrates }}g</div>
                <div class="nutrition-detail-label">Węglowodany</div>
              </div>
              <div class="nutrition-detail-item">
                <div class="nutrition-detail-value">{{ recipe()!.nutrition.fats }}g</div>
                <div class="nutrition-detail-label">Tłuszcze</div>
              </div>
              <div class="nutrition-detail-item">
                <div class="nutrition-detail-value">{{ recipe()!.nutrition.fiber }}g</div>
                <div class="nutrition-detail-label">Błonnik</div>
              </div>
            </div>

            <p-divider></p-divider>

            <h3>Składniki</h3>
            <ul class="ingredients-list">
              <li *ngFor="let ingredient of recipe()!.ingredients">
                <i class="pi pi-circle-fill" style="font-size: 0.5rem; color: var(--primary-color);"></i>
                <span>{{ ingredient.amount }} {{ ingredient.unit }} {{ ingredient.name }}</span>
              </li>
            </ul>

            <p-divider></p-divider>

            <h3>Instrukcje</h3>
            <ol class="instructions-list">
              <li *ngFor="let instruction of recipe()!.instructions; let i = index">
                <span class="step-number">{{ i + 1 }}</span>
                <span>{{ instruction }}</span>
              </li>
            </ol>
          </p-card>
        </div>
      </div>
    </div>

    <div *ngIf="!recipe()" class="empty-state">
      <i class="pi pi-exclamation-triangle" style="font-size: 3rem; color: var(--text-color-secondary);"></i>
      <p>Przepis nie został znaleziony</p>
    </div>
  `,
  styles: [`
    .recipe-meta-detail {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-top: 1.5rem;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .meta-item i {
      font-size: 1.5rem;
      color: var(--primary-color);
    }

    .meta-label {
      font-size: 0.75rem;
      color: var(--text-color-secondary);
    }

    .meta-value {
      font-size: 1.125rem;
      font-weight: 700;
    }

    .nutrition-detail-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .nutrition-detail-item {
      text-align: center;
      padding: 1rem;
      background: var(--surface-section);
      border-radius: 8px;
    }

    .nutrition-detail-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-color);
    }

    .nutrition-detail-label {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
      margin-top: 0.5rem;
    }

    .ingredients-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .ingredients-list li {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--surface-border);
    }

    .ingredients-list li:last-child {
      border-bottom: none;
    }

    .instructions-list {
      list-style: none;
      padding: 0;
      margin: 0;
      counter-reset: step-counter;
    }

    .instructions-list li {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      margin-bottom: 0.75rem;
      background: var(--surface-section);
      border-radius: 8px;
      counter-increment: step-counter;
    }

    .step-number {
      flex-shrink: 0;
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-color);
      color: white;
      border-radius: 50%;
      font-weight: 700;
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

    @media (max-width: 992px) {
      .grid {
        grid-template-columns: 1fr !important;
      }

      .recipe-meta-detail,
      .nutrition-detail-grid {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }
  `]
})
export class RecipeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recipeService = inject(RecipeService);

  recipe = signal<Recipe | undefined>(undefined);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const foundRecipe = this.recipeService.getRecipeById(id);
      this.recipe.set(foundRecipe);
    }
  }

  goBack(): void {
    this.router.navigate(['/recipes']);
  }

  getDifficultyLabel(difficulty: string): string {
    const labels: Record<string, string> = {
      'easy': 'Łatwy',
      'medium': 'Średni',
      'hard': 'Trudny'
    };
    return labels[difficulty];
  }

  getDifficultySeverity(difficulty: string): 'success' | 'info' | 'warn' {
    const severities: Record<string, 'success' | 'info' | 'warn'> = {
      'easy': 'success',
      'medium': 'info',
      'hard': 'warn'
    };
    return severities[difficulty];
  }

  getDietaryLabel(tag: string): string {
    const labels: Record<string, string> = {
      'vegetarian': 'Wegetariańskie',
      'vegan': 'Wegańskie',
      'gluten-free': 'Bezglutenowe',
      'dairy-free': 'Bez laktozy'
    };
    return labels[tag] || tag;
  }
}