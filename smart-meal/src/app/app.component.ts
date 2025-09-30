import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenubarModule],
  template: `
    <div class="app-wrapper">
      <header class="app-header">
        <p-menubar [model]="menuItems">
          <ng-template pTemplate="start">
            <div class="brand">
              <i class="pi pi-heart-fill brand-icon"></i>
              <span class="brand-name">SmartMeal</span>
            </div>
          </ng-template>
        </p-menubar>
      </header>

      <main class="layout-main-container">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background: var(--surface-ground);
    }

    .app-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: var(--surface-card);
      box-shadow: var(--shadow-sm);
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding-right: 1.5rem;
      border-right: 1px solid var(--surface-border);
      margin-right: 1rem;
    }

    .brand-icon {
      font-size: 1.5rem;
      color: var(--primary-600);
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-color);
      letter-spacing: -0.025em;
    }

    .layout-main-container {
      flex: 1;
    }

    @media (max-width: 768px) {
      .brand {
        padding-right: 0.75rem;
        margin-right: 0.75rem;
      }

      .brand-name {
        font-size: 1.125rem;
      }
    }
  `]
})
export class AppComponent {
  menuItems: MenuItem[] = [
    {
      label: 'Planer',
      icon: 'pi pi-calendar',
      routerLink: '/planner'
    },
    {
      label: 'Przepisy',
      icon: 'pi pi-book',
      routerLink: '/recipes'
    },
    {
      label: 'Lista zakupów',
      icon: 'pi pi-shopping-cart',
      routerLink: '/shopping'
    },
    {
      label: 'Waga',
      icon: 'pi pi-chart-line',
      routerLink: '/weight'
    },
    {
      label: 'Statystyki',
      icon: 'pi pi-chart-bar',
      routerLink: '/stats'
    }
  ];
}