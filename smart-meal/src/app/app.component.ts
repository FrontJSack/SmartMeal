import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MenubarModule
  ],
  template: `
    <div class="layout-wrapper">
      <p-menubar [model]="menuItems">
        <ng-template pTemplate="start">
          <div class="flex align-center gap-2">
            <i class="pi pi-heart-fill" style="font-size: 1.5rem; color: var(--primary-color)"></i>
            <span class="font-bold text-xl">SmartMeal</span>
          </div>
        </ng-template>
      </p-menubar>

      <main class="layout-main-container">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .layout-main-container {
      flex: 1;
    }

    :host ::ng-deep .p-menubar {
      border-radius: 0;
      border-left: none;
      border-right: none;
      border-top: none;
    }

    .font-bold {
      font-weight: 700;
    }

    .text-xl {
      font-size: 1.25rem;
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