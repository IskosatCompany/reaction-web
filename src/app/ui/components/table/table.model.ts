import { TemplateRef } from '@angular/core';
import { Observable } from 'rxjs';

export interface TableColumn<T> {
  id: Extract<keyof T, string> | 'table-actions';
  label: string;
  width?: number;
  template?: TemplateRef<TableCellTemplate<T>>;
  isDisabled?: (row: T) => boolean;
}

export interface TableCellTemplate<T> {
  row: T;
  column: TableColumn<T>;
}

export interface PaginatedTableDataSource<DataModel> {
  data$: Observable<TableData<DataModel>[]>;
}

export type TableData<T> = {
  [key in keyof T]: T[key];
};

export interface TableRowAction<T> {
  id: string;
  icon: string;
  callback?: (row: T) => void;
  isDisabled?: (row: T) => boolean;
  tooltip?: (row: T) => boolean;
  iconColor?: (row: T) => string;
}
