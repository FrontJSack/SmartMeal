import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { MealPlannerService } from '../../core/services/meal-planner.service';
import { WeightTrackerService } from '../../core/services/weight-tracker.service';
import { RecipeService } from '../../core/services/recipe.service';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ChartModule,
    CalendarModule
  ],
  template: `
    <div>
      <h1 class="page-title mb-4">Statystyki i Postępy</h1>

      <div class="grid mb-4" style="grid-template-columns: repeat(4, 1fr); gap: 1.5rem;">
        <div class="stat-card">
          <div class="stat-label">Zaplanowanych posiłków</div>
          <div class="stat-value">{{ getPlannedMealsCount() }}</div>
          <div class="stat-sublabel">w tym tygodniu</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Średnio kalorii dziennie</div>
          <div class="stat-value">{{ getAverageDailyCalories() }}</div>
          <div class="stat-sublabel">kcal</div>
        </div>

        <div class="stat-card">
          <div class="stat-label">Pomiarów wagi</div>
          <div class="stat-value">{{ weightService.entries().length }}</div>
          <div class="stat-sublabel">od początku</div>
        </div>

        <div class="stat-card" *ngIf="weightService.weightChange() as change">
          <div class="stat-label">Zmiana wagi</div>
          <div class="stat-value" [class.stat-change]="true"
               [class.positive]="change.absolute < 0"
               [class.negative]="change.absolute > 0">
            {{ change.absolute > 0 ? '+' : '' }}{{ change.absolute }} kg
          </div>
          <div class="stat-sublabel">{{ change.percentage > 0 ? '+' : '' }}{{ change.percentage }}%</div>
        </div>
      </div>

      <div class="grid mb-4" style="grid-template-columns: 2fr 1fr; gap: 1.5rem;">
        <p-card header="Kalorie tygodniowe">
          <p-chart type="bar" [data]="weeklyCaloriesData" [options]="chartOptions"></p-chart>
        </p-card>

        <p-card header="Makroskładniki">
          <p-chart type="doughnut" [data]="macrosData" [options]="doughnutOptions"></p-chart>
          <div class="macros-legend">
            <div class="macro-item">
              <span class="macro-dot" style="background: #22c55e;"></span>
              <span>Białko: {{ getWeeklyMacros().protein }}g</span>
            </div>
            <div class="macro-item">
              <span class="macro-dot" style="background: #3b82f6;"></span>
              <span>Węglowodany: {{ getWeeklyMacros().carbs }}g</span>
            </div>
            <div class="macro-item">
              <span class="macro-dot" style="background: #f59e0b;"></span>
              <span>Tłuszcze: {{ getWeeklyMacros().fats }}g</span>
            </div>
          </div>
        </p-card>
      </div>

      <div *ngIf="weightService.entries().length > 1">
        <p-card header="Historia wagi">
          <p-chart type="line" [data]="weightHistoryData" [options]="lineChartOptions"></p-chart>
        </p-card>
      </div>

      <div *ngIf="getPlannedMealsCount() === 0 && weightService.entries().length === 0" 
           class="empty-state">
        <i class="pi pi-chart-bar" style="font-size: 4rem; color: var(--text-color-secondary);"></i>
        <h3>Brak danych do wyświetlenia</h3>
        <p>Zacznij planować posiłki i śledzić wagę, aby zobaczyć statystyki</p>
      </div>
    </div>
  `,
  styles: [`
    .stat-card {
      background: var(--surface-card);
      border-radius: 12px;
      padding: 1.5rem;
      border-left: 4px solid var(--primary-color);
    }

    .stat-sublabel {
      font-size: 0.875rem;
      color: var(--text-color-secondary);
      margin-top: 0.25rem;
    }

    .macros-legend {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .macro-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
    }

    .macro-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: inline-block;
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

    @media (max-width: 992px) {
      .grid {
        grid-template-columns: 1fr !important;
      }
    }
  `]
})
export class StatisticsComponent {
  private mealPlannerService = inject(MealPlannerService);
  weightService = inject(WeightTrackerService);

  chartOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  doughnutOptions = {
    plugins: {
      legend: {
        display: false
      }
    }
  };

  lineChartOptions = {
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    }
  };

  get weeklyCaloriesData() {
    const days = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd'];
    const dayKeys: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'> = 
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    const data = dayKeys.map(day => 
      this.mealPlannerService.getDayNutrition(day).calories
    );

    return {
      labels: days,
      datasets: [{
        label: 'Kalorie',
        data: data,
        backgroundColor: '#22c55e',
        borderRadius: 8
      }]
    };
  }

  get macrosData() {
    const macros = this.getWeeklyMacros();
    
    return {
      labels: ['Białko', 'Węglowodany', 'Tłuszcze'],
      datasets: [{
        data: [macros.protein, macros.carbs, macros.fats],
        backgroundColor: ['#22c55e', '#3b82f6', '#f59e0b']
      }]
    };
  }

  get weightHistoryData() {
    const entries = this.weightService.entries();
    
    return {
      labels: entries.map(e => e.date.toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' })),
      datasets: [{
        label: 'Waga (kg)',
        data: entries.map(e => e.weight),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true
      }]
    };
  }

  getPlannedMealsCount(): number {
    const plan = this.mealPlannerService.weekPlan();
    let count = 0;
    
    Object.values(plan.days).forEach(day => {
      count += Object.values(day.meals).filter(meal => meal !== null).length;
    });
    
    return count;
  }

  getAverageDailyCalories(): number {
    const days: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'> = 
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    let total = 0;
    days.forEach(day => {
      total += this.mealPlannerService.getDayNutrition(day).calories;
    });
    
    return Math.round(total / 7);
  }

  getWeeklyMacros() {
    const days: Array<'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'> = 
      ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    
    let protein = 0;
    let carbs = 0;
    let fats = 0;
    
    days.forEach(day => {
      const nutrition = this.mealPlannerService.getDayNutrition(day);
      protein += nutrition.protein;
      carbs += nutrition.carbohydrates;
      fats += nutrition.fats;
    });
    
    return {
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats)
    };
  }
}