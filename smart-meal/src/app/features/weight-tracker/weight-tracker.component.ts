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
import { DialogModule } from 'primeng/dialog';
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
    TagModule,
    DialogModule
  ],
  template: `
    <div class="weight-container">
      <h1 class="page-title mb-4">Śledzenie Wagi</h1>

      <div class="weight-grid">
        <div class="weight-form-card">
          <p-card header="Dodaj pomiar wagi">
            <div class="form-field">
              <label for="weight">Waga (kg)</label>
              <p-inputNumber 
                [(ngModel)]="newWeight"
                inputId="weight"
                [minFractionDigits]="1"
                [maxFractionDigits]="1"
                [min]="30"
                [max]="300"
                placeholder="Podaj wagę (kg)">
              </p-inputNumber>
            </div>

            <div class="form-field">
              <label>Data pomiaru</label>
              <div class="date-input-wrapper" (click)="showDateDialog = true">
                <input 
                  type="text" 
                  [value]="formatDate(newDate)"
                  readonly
                  placeholder="Wybierz datę"
                  class="date-display-input">
                <i class="pi pi-calendar date-icon"></i>
              </div>
            </div>

            <div class="form-field">
              <label for="notes">Notatki (opcjonalnie)</label>
              <input 
                pInputText
                [(ngModel)]="newNotes"
                inputId="notes"
                placeholder="Dodaj notatkę..." />
            </div>

            <p-button 
              label="Dodaj pomiar" 
              icon="pi pi-plus"
              (onClick)="addEntry()">
            </p-button>
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

      <p-card header="Historia pomiarów" class="history-card">
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

    <!-- Date Picker Dialog -->
    <p-dialog 
      [(visible)]="showDateDialog"
      [modal]="true"
      [draggable]="false"
      [resizable]="false"
      styleClass="date-picker-dialog"
      header="Wybierz datę">
      <p-datePicker 
        [(ngModel)]="newDate"
        [inline]="true"
        dateFormat="dd.mm.yy">
      </p-datePicker>
      <ng-template pTemplate="footer">
        <p-button 
          label="Anuluj" 
          severity="secondary"
          (onClick)="showDateDialog = false">
        </p-button>
        <p-button 
          label="Wybierz" 
          (onClick)="showDateDialog = false">
        </p-button>
      </ng-template>
    </p-dialog>
  `,
  styles: [`
  /* Container */
  .weight-container {
    position: relative;
  }

  /* Layout */
  .weight-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 2rem;
    margin-bottom: 2rem;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  /* Form Fields */
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

  /* Custom Date Input */
  .date-input-wrapper {
    position: relative;
    width: 100%;
    max-width: 350px;
    cursor: pointer;
  }

  .date-display-input {
    width: 100%;
    background: var(--surface-section);
    border: 2px solid var(--surface-border);
    color: var(--text-color);
    border-radius: 12px;
    padding: 0.875rem 3rem 0.875rem 1.25rem;
    transition: all 0.2s;
    cursor: pointer;
    font-size: 1rem;
    font-family: inherit;
  }

  .date-display-input:hover {
    border-color: var(--primary-500);
  }

  .date-display-input:focus {
    outline: none;
    border-color: var(--primary-500);
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
  }

  .date-icon {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-color-secondary);
    pointer-events: none;
    font-size: 1.125rem;
  }

  /* Input Styling */
  :host ::ng-deep .weight-form-card .p-inputnumber,
  :host ::ng-deep .weight-form-card input[pInputText] {
    width: 100%;
    max-width: 350px;
  }

  /* Weight Input */
  :host ::ng-deep .weight-form-card .p-inputnumber-input {
    width: 100%;
    text-align: center;
    font-size: 1.125rem;
    font-weight: 600;
    background: var(--surface-section);
    border: 2px solid var(--surface-border);
    color: var(--text-color);
    border-radius: 12px;
    padding: 0.875rem 1.25rem;
    transition: all 0.2s;
  }

  :host ::ng-deep .weight-form-card .p-inputnumber-input:focus {
    border-color: var(--primary-500);
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
    outline: none;
  }

  /* Text Input */
  :host ::ng-deep .weight-form-card input[pInputText] {
    width: 100%;
    background: var(--surface-section);
    border: 2px solid var(--surface-border);
    color: var(--text-color);
    border-radius: 12px;
    padding: 0.875rem 1.25rem;
    transition: all 0.2s;
  }

  :host ::ng-deep .weight-form-card input[pInputText]:focus {
    border-color: var(--primary-500);
    box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.1);
    outline: none;
  }

  /* Button */
  :host ::ng-deep .weight-form-card .p-button {
    width: 100%;
    padding: 1rem 1.75rem;
    font-weight: 600;
    border-radius: 12px;
    background: var(--primary-600);
    color: white;
    border: 2px solid var(--primary-600);
    margin-top: 0.5rem;
    transition: all 0.2s;
  }

  :host ::ng-deep .weight-form-card .p-button:hover {
    background: var(--primary-700);
    border-color: var(--primary-700);
    transform: translateY(-2px);
  }

  /* Date Picker Dialog Styling */
  :host ::ng-deep .date-picker-dialog .p-dialog {
    max-width: 450px;
    width: 90vw;
  }

  :host ::ng-deep .date-picker-dialog .p-dialog-content {
    padding: 1.5rem !important;
  }

  :host ::ng-deep .date-picker-dialog .p-datepicker {
    border: none;
    box-shadow: none;
    width: 100%;
  }

  /* Dialog Footer Buttons - Match App Style */
  :host ::ng-deep .date-picker-dialog .p-dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    padding: 1rem 1.5rem !important;
    background: var(--surface-section) !important;
    border-top: 1px solid var(--surface-border) !important;
  }

  :host ::ng-deep .date-picker-dialog .p-dialog-footer .p-button {
    padding: 0.875rem 1.75rem !important;
    font-weight: 600 !important;
    font-size: 1rem !important;
    border-radius: 12px !important;
  }

  /* Primary Button (Wybierz) */
  :host ::ng-deep .date-picker-dialog .p-dialog-footer .p-button:not([severity]) {
    background: var(--primary-600) !important;
    color: white !important;
    border: 2px solid var(--primary-600) !important;
  }

  :host ::ng-deep .date-picker-dialog .p-dialog-footer .p-button:not([severity]):hover {
    background: var(--primary-700) !important;
    border-color: var(--primary-700) !important;
    transform: translateY(-2px) !important;
  }

  /* Secondary Button (Anuluj) */
  :host ::ng-deep .date-picker-dialog .p-dialog-footer .p-button[severity="secondary"] {
    background: transparent !important;
    color: var(--text-color) !important;
    border: 2px solid var(--surface-border) !important;
  }

  :host ::ng-deep .date-picker-dialog .p-dialog-footer .p-button[severity="secondary"]:hover {
    background: transparent !important;
    border-color: var(--primary-500) !important;
    color: var(--primary-500) !important;
  }

  /* Mobile Responsive Dialog */
  @media (max-width: 768px) {
    :host ::ng-deep .date-picker-dialog .p-dialog {
      width: 95vw !important;
      max-width: 95vw !important;
    }

    :host ::ng-deep .date-picker-dialog .p-dialog-content {
      padding: 1rem !important;
      max-height: 60vh !important;
      overflow-y: auto !important;
    }

    :host ::ng-deep .date-picker-dialog .p-datepicker {
      transform: scale(0.9);
      transform-origin: top center;
    }

    :host ::ng-deep .date-picker-dialog .p-dialog-footer {
      padding: 0.75rem 1rem !important;
      gap: 0.5rem !important;
      position: sticky !important;
      bottom: 0 !important;
      background: var(--surface-section) !important;
      z-index: 10 !important;
    }

    :host ::ng-deep .date-picker-dialog .p-dialog-footer .p-button {
      flex: 1 !important;
      padding: 1rem !important;
      font-size: 0.9375rem !important;
    }
  }

  /* Table */
  :host ::ng-deep .p-datatable {
    border-radius: 16px;
    overflow: hidden;
    margin-top: 1rem;
  }

  :host ::ng-deep .p-datatable .p-datatable-thead > tr > th {
    background: var(--surface-section);
    color: var(--text-color);
    font-weight: 600;
    padding: 1.25rem 1.5rem;
  }

  :host ::ng-deep .p-datatable .p-datatable-tbody > tr {
    background: var(--surface-card);
  }

  :host ::ng-deep .p-datatable .p-datatable-tbody > tr:hover {
    background: var(--surface-hover);
  }

  :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
    padding: 1.25rem 1.5rem;
    color: var(--text-color);
  }

  .empty-state {
    padding: 2rem;
    text-align: center;
    color: var(--text-color-secondary);
  }

  /* Mobile Responsive */
  @media (max-width: 992px) {
    .weight-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (max-width: 768px) {
    .date-input-wrapper,
    :host ::ng-deep .weight-form-card .p-inputnumber,
    :host ::ng-deep .weight-form-card input[pInputText] {
      max-width: none;
    }

    :host ::ng-deep .p-datatable .p-datatable-thead > tr > th,
    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 0.75rem 0.5rem;
      font-size: 0.875rem;
    }
  }
`]
})
export class WeightTrackerComponent {
  weightService = inject(WeightTrackerService);

  newWeight: number | null = null;
  newDate: Date = new Date();
  newNotes = '';
  showDateDialog = false;

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

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