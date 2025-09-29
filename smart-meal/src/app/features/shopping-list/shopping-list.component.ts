import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ShoppingListService, ShoppingItem } from '../../core/services/shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    CheckboxModule,
    DividerModule
  ],
  template: `
    <div>
      <div class="flex justify-between align-center mb-4">
        <h1 class="page-title">Lista Zakupów</h1>
        <div class="flex gap-2">
          <p-button label="Wróć do planera" 
                    icon="pi pi-arrow-left"
                    [outlined]="true"
                    (onClick)="goToPlanner()"></p-button>
          <p-button label="Wyczyść zaznaczone" 
                    icon="pi pi-trash"
                    severity="danger"
                    [outlined]="true"
                    (onClick)="clearChecked()"></p-button>
        </div>
      </div>

      <div class="shopping-summary mb-4">
        <p-card>
          <div class="grid" style="grid-template-columns: repeat(3, 1fr); gap: 1rem;">
            <div class="stat-card">
              <div class="stat-label">Wszystkich produktów</div>
              <div class="stat-value">{{ getTotalItems() }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Do kupienia</div>
              <div class="stat-value">{{ getUncheckedItems() }}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Kupione</div>
              <div class="stat-value stat-change positive">{{ getCheckedItems() }}</div>
            </div>
          </div>
        </p-card>
      </div>

      <div *ngIf="shoppingService.shoppingList().length > 0; else emptyList">
        <div *ngFor="let category of getCategories()" class="category-section mb-4">
          <p-card>
            <ng-template pTemplate="header">
              <div class="category-header">
                <h3>{{ getCategoryLabel(category) }}</h3>
                <span class="category-count">{{ getCategoryItems(category).length }} produktów</span>
              </div>
            </ng-template>

            <div class="items-list">
              <div *ngFor="let item of getCategoryItems(category)" 
                   class="item-row"
                   [class.checked]="item.checked">
                <p-checkbox [(ngModel)]="item.checked"
                           [binary]="true"
                           (onChange)="toggleItem(item)"
                           [inputId]="item.name"></p-checkbox>
                
                <label [for]="item.name" class="item-label">
                  <span class="item-name">{{ item.name }}</span>
                  <span class="item-amount">{{ item.amount }} {{ item.unit }}</span>
                </label>
              </div>
            </div>
          </p-card>
        </div>
      </div>

      <ng-template #emptyList>
        <div class="empty-state">
          <i class="pi pi-shopping-cart" style="font-size: 4rem; color: var(--text-color-secondary);"></i>
          <h3>Lista zakupów jest pusta</h3>
          <p>Dodaj posiłki do planera, aby wygenerować listę zakupów</p>
          <p-button label="Przejdź do planera" 
                    icon="pi pi-calendar"
                    (onClick)="goToPlanner()"></p-button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .shopping-summary {
      margin-bottom: 2rem;
    }

    .stat-card {
      text-align: center;
      padding: 1rem;
    }

    .category-section {
      animation: fadeIn 0.3s ease-out;
    }

    .category-header {
      padding: 1rem 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .category-header h3 {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 700;
      color: var(--primary-color);
    }

    .category-count {
      color: var(--text-color-secondary);
      font-size: 0.875rem;
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .item-row {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: var(--surface-section);
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .item-row:hover {
      background: var(--surface-overlay);
    }

    .item-row.checked {
      opacity: 0.6;
    }

    .item-row.checked .item-name {
      text-decoration: line-through;
    }

    .item-label {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
    }

    .item-name {
      font-weight: 600;
    }

    .item-amount {
      color: var(--text-color-secondary);
      font-size: 0.875rem;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: var(--text-color-secondary);
    }

    .empty-state i {
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      margin: 1rem 0 0.5rem 0;
      color: var(--text-color);
    }

    .empty-state p {
      margin-bottom: 1.5rem;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @media (max-width: 768px) {
      .shopping-summary .grid {
        grid-template-columns: 1fr !important;
      }

      .category-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }
    }
  `]
})
export class ShoppingListComponent {
  shoppingService = inject(ShoppingListService);
  private router = inject(Router);

  getCategories(): string[] {
    const items = this.shoppingService.shoppingList();
    const categories = new Set(items.map(item => item.category));
    return Array.from(categories).sort();
  }

  getCategoryItems(category: string): ShoppingItem[] {
    return this.shoppingService.shoppingList().filter(item => item.category === category);
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      protein: 'Białko',
      vegetables: 'Warzywa',
      fruits: 'Owoce',
      grains: 'Zboża i pieczywo',
      dairy: 'Nabiał',
      other: 'Inne'
    };
    return labels[category] || category;
  }

  getTotalItems(): number {
    return this.shoppingService.shoppingList().length;
  }

  getCheckedItems(): number {
    return this.shoppingService.shoppingList().filter(item => item.checked).length;
  }

  getUncheckedItems(): number {
    return this.getTotalItems() - this.getCheckedItems();
  }

  toggleItem(item: ShoppingItem): void {
    this.shoppingService.toggleItem(item);
  }

  clearChecked(): void {
    if (confirm('Czy na pewno chcesz wyczyścić zaznaczone produkty?')) {
      this.shoppingService.clearChecked();
    }
  }

  goToPlanner(): void {
    this.router.navigate(['/planner']);
  }
}