import { TemplateRef } from '@angular/core';
import { TableActionsColumn } from './table-action.interface';

export interface TableColumn<T = unknown> {
  key: Extract<keyof T, string> | string;
  header: string;
  width?: string;
  cellFn?: (row: T) => string;
  template?: TemplateRef<{ $implicit: T }>;
  actions?: TableActionsColumn<T>[];
}
