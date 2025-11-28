import { Observable } from 'rxjs';
import { TableColumn } from './table-column.interface';

export interface TableConfig<T = unknown> {
  columns: TableColumn<T>[];
  data$: Observable<T[]>;
}
