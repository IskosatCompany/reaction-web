import { Observable, of } from 'rxjs';
import { TableColumn } from './table-column.interface';
import { TableConfig } from './table-config.interface';

export class TableBuilder<T> {
  #columns: TableColumn<T>[] = [];
  #data?: Observable<T[]>;

  column(col: TableColumn<T>) {
    this.#columns.push(col);
    return this;
  }

  columns(cols: TableColumn<T>[]) {
    this.#columns = [...cols];
    return this;
  }

  fromObservable(obs$: Observable<T[]>) {
    this.#data = obs$;
    return this;
  }

  build(): TableConfig<T> {
    return { columns: this.#columns, data$: this.#data ?? of([]) };
  }
}
