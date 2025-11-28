import { CdkTableModule } from '@angular/cdk/table';
import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, effect, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { tap } from 'rxjs';
import { TableConfig } from './models/table-config.interface';

@Component({
  selector: 'app-table',
  imports: [
    NgTemplateOutlet,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatProgressSpinnerModule,
    CdkTableModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T> {
  config = input.required<TableConfig<T>>();

  columns = computed(() => {
    const cols = this.config().columns;
    return cols.map((item) => item.key as string);
  });
  isLoading = signal(true);
  data = signal<T[]>([]);

  constructor() {
    effect(() => {
      this.config()
        .data$.pipe(tap(() => this.isLoading.set(true)))
        .subscribe({
          next: (data) => {
            this.data.set([...data]);
            this.isLoading.set(false);
          }
        });
    });
  }
}
