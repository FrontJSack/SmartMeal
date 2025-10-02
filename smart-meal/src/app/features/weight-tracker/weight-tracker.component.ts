import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { DatePickerModule } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { WeightTrackerService } from '../../core/services/weight-tracker.service';
import { WeightEntry } from '../../core/models/weight.model';

@Component({
  selector: 'app-weight-tracker',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputNumberModule,
    DatePickerModule,
    InputTextModule,
    TableModule,
    TagModule
  ],
  template: `
    <div>
      <h1 class="page-title mb-4">Śledzenie Wagi</h1>

      <div class="weight-grid">
        <div class="weight-form-card">
          <p-card header="Dodaj pomiar wagi">
            <div class="form-field">
              <label for="weight">Waga (kg)</label>
              <p-inputNumber [(ngModel)]="newWeight"
                            inputId="weight"
                            [minFractionDigits]="1"
                            [maxFractionDigits]="1"
                            [min]="30"
                            [max]="300"
                            [style]="{'width': '100%'}"></p-inputNumber>
            </div>

            <div class="form-field">
              <label for="date">Data pomiaru</label>
              <p-datePicker [(ngModel)]="newDate"
                           inputId="date"
                           [showIcon]="true"
                           dateFormat="dd.mm.yy"
                           [style]="{'width': '100%'}"></p-datePicker>
            </div>

            <div class="form-field">
              <label for="notes">Notatki (opcjonalnie)</label>
              <input pInputText
                     [(ngModel)]="newNotes"
                     inputId="notes"
                     placeholder="Dodaj notatkę..."
                     [style]="{'width': '100%'}" />
            </div>

            <p-button label="Dodaj pomiar" 
                     icon="pi pi-plus"
                     [style]="{'width': '100%'}"
                     (onClick)="addEntry()"></p-button>
          </p-card>
        </div>

        <div class="weight-stats-card">
          <p-card header="Twoje postępy">
            <div class="stats-grid">
              <div class="stat-card">
                <div class="stat-label">Aktualna waga</div>
                <div class="stat-value">
                  {{ weightService.latestEntry()?.weight || '-' }} kg
                </div>
              </div>

              <div class="stat-card" *ngIf="weightService.weightChange() as change">
                <div class="stat-label">Zmiana wagi</div>
                <div class="stat-value" [class.stat-change]="true"
                     [class.positive]="change.absolute < 0"
                     [class.negative]="change.absolute > 0">
                  {{ change.absolute > 0 ? '+' : '' }}{{ change.absolute }} kg
                </div>
                <div class="stat-change" [class.positive]="change.percentage < 0"
                     [class.negative]="change.percentage > 0">
                  {{ change.percentage > 0 ? '+' : '' }}{{ change.percentage }}%
                </div>
              </div>

              <div class="stat-card">
                <div class="stat-label">Liczba pomiarów</div>
                <div class="stat-value">{{ weightService.entries().length }}</div>
              </div>

              <div class="stat-card" *ngIf="weightService.entries().length > 0">
                <div class="stat-label">Pierwszy pomiar</div>
                <div class="stat-value" style="font-size: 1.25rem;">
                  {{ weightService.entries()[0].date | date:'dd.MM.yyyy' }}
                </div>
              </div>
            </div>
          </p-card>
        </div>
      </div>

      <p-card header="Historia pomiarów">
        <p-table [value]="weightService.entries()" 
                 [tableStyle]="{'min-width': '50rem'}">
          <ng-template pTemplate="header">
            <tr>
              <th>Data</th>
              <th>Waga</th>
              <th>Zmiana</th>
              <th>Notatki</th>
              <th style="width: 100px;">Akcje</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-entry let-i="rowIndex">
            <tr>
              <td>{{ entry.date | date:'dd.MM.yyyy HH:mm' }}</td>
              <td><strong>{{ entry.weight }} kg</strong></td>
              <td>
                <p-tag *ngIf="i > 0"
                      [value]="getWeightDiff(i)"
                      [severity]="getWeightDiffSeverity(i)"></p-tag>
                <span *ngIf="i === 0">-</span>
              </td>
              <td>{{ entry.notes || '-' }}</td>
              <td>
                <p-button icon="pi pi-trash" 
                         [rounded]="true"
                         [text]="true"
                         severity="danger"
                         size="small"
                         (onClick)="deleteEntry(entry.id)"></p-button>
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="emptymessage">
            <tr>
              <td colspan="5">
                <div class="empty-state">
                  <i class="pi pi-inbox" style="font-size: 2rem; display: block; margin-bottom: 1rem;"></i>
                  Brak pomiarów wagi. Dodaj swój pierwszy pomiar!
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </p-card>
    </div>
  `,
  styles: [`
    .form-field {
      margin-bottom: 1.5rem;
    }

    .form-field label {
      display: block;
      margin-bottom: 0.75rem;
      font-weight: 600;
      color: var(--text-color);
      font-size: 0.9375rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    /* Fix DatePicker visibility */
    :host ::ng-deep .p-datepicker {
      background: var(--surface-card) !important;
      border: 1px solid var(--surface-border) !important;
      border-radius: 16px !important;
      box-shadow: var(--shadow-lg) !important;
      padding: 1rem !important;
    }

    :host ::ng-deep .p-datepicker .p-datepicker-header {
      background: var(--surface-section) !important;
      border-radius: 12px !important;
      padding: 0.75rem !important;
      margin-bottom: 0.75rem !important;
      border: none !important;
    }

    :host ::ng-deep .p-datepicker .p-datepicker-title {
      color: var(--text-color) !important;
      font-weight: 600 !important;
    }

    :host ::ng-deep .p-datepicker table {
      margin-top: 0.5rem !important;
    }

    :host ::ng-deep .p-datepicker table td {
      padding: 0.5rem !important;
    }

    :host ::ng-deep .p-datepicker table td > span {
      width: 2.5rem !important;
      height: 2.5rem !important;
      border-radius: 10px !important;
      color: var(--text-color) !important;
      transition: all var(--transition-base) !important;
    }

    :host ::ng-deep .p-datepicker table td > span:hover {
      background: var(--surface-hover) !important;
    }

    :host ::ng-deep .p-datepicker table td > span.p-highlight {
      background: var(--primary-600) !important;
      color: white !important;
    }

    :host ::ng-deep .p-datepicker .p-datepicker-calendar thead tr th {
      color: var(--text-color-secondary) !important;
      font-weight: 600 !important;
      padding: 0.5rem !important;
    }

    :host ::ng-deep .p-datepicker-prev,
    :host ::ng-deep .p-datepicker-next {
      color: var(--text-color) !important;
      width: 2.5rem !important;
      height: 2.5rem !important;
      border-radius: 10px !important;
      transition: all var(--transition-base) !important;
    }

    :host ::ng-deep .p-datepicker-prev:hover,
    :host ::ng-deep .p-datepicker-next:hover {
      background: var(--surface-hover) !important;
      color: var(--primary-500) !important;
    }

    /* Enhanced Table Styling */
    :host ::ng-deep .p-datatable {
      border-radius: 16px !important;
      overflow: hidden !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
      background: var(--surface-section) !important;
      color: var(--text-color) !important;
      font-weight: 600 !important;
      border-bottom: 2px solid var(--surface-border) !important;
      padding: 1.25rem 1.5rem !important;
      font-size: 0.9375rem !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
      background: var(--surface-card) !important;
      transition: all var(--transition-base) !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
      background: var(--surface-hover) !important;
      transform: scale(1.005) !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 1.25rem 1.5rem !important;
      border-bottom: 1px solid var(--surface-border) !important;
      color: var(--text-color) !important;
      font-size: 0.9375rem !important;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr:last-child > td {
      border-bottom: none !important;
    }

    .empty-state {
      padding: 2rem !important;
      text-align: center !important;
      color: var(--text-color-secondary) !important;
    }

    @media (max-width: 992px) {
      .grid {
        grid-template-columns: 1fr !important;
      }

      .stats-grid {
        grid-template-columns: 1fr !important;
      }
    }

    .weight-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    margin-bottom: 2rem;
    }

    @media (max-width: 992px) {
      .weight-grid {
        grid-template-columns: 1fr;
      }
    }
    `]
})
export class WeightTrackerComponent {
  weightService = inject(WeightTrackerService);

  newWeight: number | null = null;
  newDate: Date = new Date();
  newNotes = '';

  addEntry(): void {
    if (!this.newWeight || this.newWeight < 30 || this.newWeight > 300) {
      alert('Proszę podać prawidłową wagę (30-300 kg)');
      return;
    }

    this.weightService.addEntry(
      this.newWeight,
      this.newDate,
      this.newNotes || undefined
    );

    this.newWeight = null;
    this.newDate = new Date();
    this.newNotes = '';
  }

  deleteEntry(id: string): void {
    if (confirm('Czy na pewno chcesz usunąć ten pomiar?')) {
      this.weightService.deleteEntry(id);
    }
  }

  getWeightDiff(index: number): string {
    const entries = this.weightService.entries();
    if (index === 0) return '-';

    const current = entries[index].weight;
    const previous = entries[index - 1].weight;
    const diff = current - previous;

    return `${diff > 0 ? '+' : ''}${diff.toFixed(1)} kg`;
  }

  getWeightDiffSeverity(index: number): 'success' | 'danger' | 'info' {
    const entries = this.weightService.entries();
    if (index === 0) return 'info';

    const current = entries[index].weight;
    const previous = entries[index - 1].weight;
    const diff = current - previous;

    if (diff < 0) return 'success';
    if (diff > 0) return 'danger';
    return 'info';
  }
}