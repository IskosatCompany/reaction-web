import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  signal,
  viewChild
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { PaginatedTableDataSource, TableColumn, TableRowAction } from './table.model';
import { MatPaginator } from '@angular/material/paginator';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { TableCellComponent } from '../table-cell/table-cell.component';
import { TableActionsCellComponent } from '../table-actions-cell/table-actions-cell.component';

@Component({
  selector: 'app-table',
  imports: [MatTableModule, TableCellComponent, TableActionsCellComponent],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T> {
  columns = input.required<TableColumn<T>[]>();
  dataSource = input.required<PaginatedTableDataSource<T>>();
  rowHeight = input<number>();
  rowActions = input<TableRowAction<T>[]>();
  headerElement = viewChild<ElementRef>('header');
  paginator = viewChild<MatPaginator>(MatPaginator);

  tableData = toSignal(
    toObservable(this.dataSource).pipe(switchMap((dataSource) => dataSource.data$)),
    { initialValue: [] }
  );
  headerHeight = signal(0);
  searchTerm = signal('');

  displayedColumns = computed<string[]>(() => {
    let columns = this.columns().map((col) => col.id);
    if (this.rowActions()) {
      columns = [...columns, 'table-actions'];
    }
    return columns;
  });

  rowActionsCellWidth = computed<number>(() => {
    const rowActions = this.rowActions();
    if (rowActions) {
      return 40 + rowActions.length * 24 + (rowActions.length - 1) * 16;
    }
    return 0;
  });
}
