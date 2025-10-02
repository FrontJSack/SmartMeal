import { Component, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ThemeService } from './core/services/theme.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MenubarModule, ButtonModule, TooltipModule],
  template: `
    <div class="app-wrapper">
      <p-menubar [model]="menuItems">
        <ng-template pTemplate="start">
          <div class="brand">
            <i class="pi pi-heart-fill"></i>
            <span>SmartMeal</span>
          </div>
        </ng-template>
        
        <ng-template pTemplate="end">
          <p-button 
            [icon]="themeService.theme() === 'dark' ? 'pi pi-sun' : 'pi pi-moon'"
            [rounded]="true"
            [text]="true"
            (onClick)="toggleTheme()"
            [pTooltip]="themeService.theme() === 'dark' ? 'Tryb jasny' : 'Tryb ciemny'"
            tooltipPosition="bottom"></p-button>
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
      margin-left: 1.25rem;
      font-size: 2rem;
      color: var(--primary-500);
    }

    .layout-main-container {
      flex: 1;
    }

    @media (max-width: 960px) {
      .brand {
        padding: 0;
        margin-right: 1rem;
        border: none;
      }
      
      .brand span {
        font-size: 1.125rem;
      }
    }

    .p-menuicon {
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid var(--surface-border);
      transition: background var(--transition-base);
    }

    .p-menuicon:hover {
      background: var(--surface-hover);
    }
  `]
})
export class AppComponent {
  themeService = inject(ThemeService);
  private router = inject(Router);

  menuItems: MenuItem[] = [];

  constructor() {
    this.initializeMenu();
    this.updateActiveMenuItem();
    
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateActiveMenuItem();
      });
  }

  private initializeMenu(): void {
    this.menuItems = [
      {
        label: 'Planer',
        icon: 'pi pi-calendar',
        routerLink: '/planner',
        command: () => this.router.navigate(['/planner'])
      },
      {
        label: 'Przepisy',
        icon: 'pi pi-book',
        routerLink: '/recipes',
        command: () => this.router.navigate(['/recipes'])
      },
      {
        label: 'Lista zakupów',
        icon: 'pi pi-shopping-cart',
        routerLink: '/shopping',
        command: () => this.router.navigate(['/shopping'])
      },
      {
        label: 'Waga',
        icon: 'pi pi-chart-line',
        routerLink: '/weight',
        command: () => this.router.navigate(['/weight'])
      },
      {
        label: 'Statystyki',
        icon: 'pi pi-chart-bar',
        routerLink: '/stats',
        command: () => this.router.navigate(['/stats'])
      }
    ];
  }

  private updateActiveMenuItem(): void {
    const currentUrl = this.router.url;
    this.menuItems.forEach(item => {
      const isActive = item.routerLink && currentUrl.includes(item.routerLink.toString());
      item.styleClass = isActive ? 'p-menuitem-active' : '';
    });
    // Force change detection
    this.menuItems = [...this.menuItems];
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}