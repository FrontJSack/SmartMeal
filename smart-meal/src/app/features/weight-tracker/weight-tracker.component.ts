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

      <div class="grid" style="grid-template-columns: 1fr 2fr; gap: 2rem; margin-bottom: 2rem;">
        <div>
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
                     [style]="{'width': '100%'}" />
            </div>

            <p-button label="Dodaj pomiar" 
                     icon="pi pi-plus"
                     [style]="{'width': '100%'}"
                     (onClick)="addEntry()"></p-button>
          </p-card>
        </div>

        <div>
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
                 [tableStyle]="{'min-width': '50rem'}"
                 styleClass="p-datatable-sm">
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
              <td colspan="5" class="text-center">
                <div style="padding: 2rem; color: var(--text-color-secondary);">
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
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: var(--text-color);
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }

    .stat-card {
      padding: 1.5rem;
      background: var(--surface-section);
      border-radius: 8px;
      text-align: center;
    }

    :host ::ng-deep .p-datatable .p-datatable-tbody > tr > td {
      padding: 1rem;
    }

    @media (max-width: 992px) {
      .grid {
        grid-template-columns: 1fr !important;
      }

      .stats-grid {
        grid-template-columns: 1fr !important;
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

    // Reset form
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