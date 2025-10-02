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
      <div class="back-button-wrapper">
        <p-button 
          label="Wróć" 
          icon="pi pi-arrow-left" 
          [outlined]="true"
          (onClick)="goBack()">
        </p-button>
      </div>

      <div class="detail-grid">
        <div class="image-section">
          <img [src]="recipe()!.imageUrl" 
               [alt]="recipe()!.name"
               class="recipe-image" />
          
          <p-card>
            <h2 class="recipe-title">{{ recipe()!.name }}</h2>
            <p class="recipe-description">
              {{ recipe()!.description }}
            </p>

            <div class="tags-section">
              <p-tag 
                [value]="getDifficultyLabel(recipe()!.difficulty)" 
                [severity]="getDifficultySeverity(recipe()!.difficulty)"
                styleClass="custom-tag">
              </p-tag>
              <p-tag 
                *ngFor="let tag of recipe()!.dietaryTags" 
                [value]="getDietaryLabel(tag)" 
                severity="success"
                styleClass="custom-tag">
              </p-tag>
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
                <i class="pi pi-fire"></i>
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

        <div class="content-section">
          <p-card>
            <h3 class="section-title">Wartości odżywcze</h3>
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

            <h3 class="section-title">Składniki</h3>
            <ul class="ingredients-list">
              <li *ngFor="let ingredient of recipe()!.ingredients">
                <i class="pi pi-circle-fill"></i>
                <span><strong>{{ ingredient.amount }} {{ ingredient.unit }}</strong> {{ ingredient.name }}</span>
              </li>
            </ul>

            <p-divider></p-divider>

            <h3 class="section-title">Instrukcje</h3>
            <ol class="instructions-list">
              <li *ngFor="let instruction of recipe()!.instructions; let i = index">
                <span class="step-number">{{ i + 1 }}</span>
                <span class="step-text">{{ instruction }}</span>
              </li>
            </ol>
          </p-card>
        </div>
      </div>
    </div>

    <div *ngIf="!recipe()" class="empty-state">
      <i class="pi pi-exclamation-triangle"></i>
      <h3>Przepis nie został znaleziony</h3>
      <p-button 
        label="Wróć do listy" 
        icon="pi pi-arrow-left"
        (onClick)="goBack()">
      </p-button>
    </div>
  `,
  styles: [`
    /* Back Button */
    .back-button-wrapper {
      margin-bottom: 2rem;
    }

    :host ::ng-deep .back-button-wrapper .p-button {
      padding: 0.875rem 1.75rem !important;
      font-size: 1rem !important;
      font-weight: 600 !important;
      border-radius: 12px !important;
      border: 2px solid var(--surface-border) !important;
      background: transparent !important;
      color: var(--text-color) !important;
      transition: all 0.2s !important;
    }

    :host ::ng-deep .back-button-wrapper .p-button:hover {
      border-color: var(--primary-500) !important;
      color: var(--primary-500) !important;
      background: rgba(34, 197, 94, 0.05) !important;
      transform: translateY(-2px) !important;
    }

    /* Grid Layout */
    .detail-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
    }

    /* Image Section */
    .image-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .recipe-image {
      width: 100%;
      border-radius: 16px;
      box-shadow: var(--shadow-md);
      object-fit: cover;
      max-height: 400px;
    }

    .recipe-title {
      margin: 0 0 1rem 0;
      font-size: 1.75rem;
      font-weight: 700;
      color: var(--text-color);
    }

    .recipe-description {
      color: var(--text-color-secondary);
      line-height: 1.7;
      margin-bottom: 1.5rem;
      font-size: 1.0625rem;
    }

    /* Tags Section */
    .tags-section {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    :host ::ng-deep .custom-tag .p-tag {
      padding: 0.625rem 1.25rem !important;
      border-radius: 12px !important;
      font-weight: 600 !important;
      font-size: 0.9375rem !important;
      line-height: 1.4 !important;
    }

    /* Recipe Meta */
    .recipe-meta-detail {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      padding: 1.5rem;
      background: var(--surface-section);
      border-radius: 12px;
      border: 1px solid var(--surface-border);
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .meta-item i {
      font-size: 1.75rem;
      color: var(--primary-500);
    }

    .meta-label {
      font-size: 0.8125rem;
      color: var(--text-color-secondary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.25rem;
    }

    .meta-value {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-color);
    }

    /* Content Section */
    .content-section {
      display: flex;
      flex-direction: column;
    }

    .section-title {
      margin: 0 0 1.5rem 0;
      font-size: 1.375rem;
      font-weight: 700;
      color: var(--text-color);
    }

    /* Nutrition Grid */
    .nutrition-detail-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.25rem;
      margin-bottom: 2rem;
    }

    .nutrition-detail-item {
      text-align: center;
      padding: 1.5rem;
      background: var(--surface-section);
      border-radius: 12px;
      border: 1px solid var(--surface-border);
      transition: all 0.2s;
    }

    .nutrition-detail-item:hover {
      border-color: var(--primary-500);
      transform: translateY(-2px);
    }

    .nutrition-detail-value {
      font-size: 2.25rem;
      font-weight: 700;
      color: var(--primary-500);
      margin-bottom: 0.5rem;
    }

    .nutrition-detail-label {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Ingredients List */
    .ingredients-list {
      list-style: none;
      padding: 0;
      margin: 0 0 2rem 0;
    }

    .ingredients-list li {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      margin-bottom: 0.5rem;
      background: var(--surface-section);
      border-radius: 10px;
      border: 1px solid var(--surface-border);
      transition: all 0.2s;
    }

    .ingredients-list li:hover {
      background: var(--surface-hover);
    }

    .ingredients-list li i {
      font-size: 0.5rem;
      color: var(--primary-500);
      flex-shrink: 0;
    }

    .ingredients-list li span {
      font-size: 1rem;
      color: var(--text-color);
    }

    /* Instructions List */
    .instructions-list {
      list-style: none;
      padding: 0;
      margin: 0;
      counter-reset: step-counter;
    }

    .instructions-list li {
      display: flex;
      gap: 1.5rem;
      padding: 1.5rem;
      margin-bottom: 1rem;
      background: var(--surface-section);
      border-radius: 12px;
      border: 1px solid var(--surface-border);
      counter-increment: step-counter;
      transition: all 0.2s;
    }

    .instructions-list li:hover {
      border-color: var(--primary-500);
      transform: translateX(4px);
    }

    .step-number {
      flex-shrink: 0;
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--primary-600);
      color: white;
      border-radius: 50%;
      font-weight: 700;
      font-size: 1.125rem;
    }

    .step-text {
      font-size: 1.0625rem;
      line-height: 1.6;
      color: var(--text-color);
    }

    /* Divider */
    :host ::ng-deep .p-divider {
      margin: 2rem 0 !important;
    }

    /* Empty State */
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--surface-card);
      border: 2px dashed var(--surface-border);
      border-radius: 16px;
    }

    .empty-state i {
      font-size: 3.5rem;
      color: var(--text-color-light);
      opacity: 0.5;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 1rem 0;
      color: var(--text-color);
      font-size: 1.25rem;
    }

    /* Mobile Responsive */
    @media (max-width: 992px) {
      .detail-grid {
        grid-template-columns: 1fr;
      }

      .recipe-meta-detail,
      .nutrition-detail-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .recipe-meta-detail {
        grid-template-columns: 1fr;
      }

      .nutrition-detail-grid {
        grid-template-columns: 1fr;
      }

      .instructions-list li {
        flex-direction: column;
        gap: 1rem;
      }

      .step-number {
        align-self: flex-start;
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