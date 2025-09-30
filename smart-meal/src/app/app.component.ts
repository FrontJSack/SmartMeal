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
      <p-menubar [model]="menuItems">
        <ng-template pTemplate="start">
          <div class="brand">
            <i class="pi pi-heart-fill"></i>
            <span>SmartMeal</span>
          </div>
        </ng-template>
      </p-menubar>

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

    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0 1.5rem 0 0;
      margin-right: 1.5rem;
      border-right: 1px solid var(--surface-border);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-color);
    }

    .brand i {
      font-size: 1.5rem;
      color: var(--primary-500);
    }

    .layout-main-container {
      flex: 1;
    }

    @media (max-width: 960px) {
      .brand {
        padding: 0;
        margin: 0;
        border: none;
      }
      
      .brand span {
        display: none;
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