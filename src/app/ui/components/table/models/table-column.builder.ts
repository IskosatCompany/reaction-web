import { TemplateRef } from '@angular/core';
import { TableActionsColumn } from './table-action.interface';
import { TableColumn } from './table-column.interface';

export class ColumnBuilder<T> {
  #col: TableColumn<T>;

  constructor(key: Extract<keyof T, string> | string, header = '') {
    this.#col = { key, header };
  }

  width(width: string): ColumnBuilder<T> {
    this.#col.width = width;
    return this;
  }

  template(tpl: TemplateRef<{ $implicit: T }>): ColumnBuilder<T> {
    this.#col.template = tpl;
    return this;
  }

  cellFn(fn: (row: T) => string): ColumnBuilder<T> {
    this.#col.cellFn = fn;
    return this;
  }

  actions(actions: TableActionsColumn<T>[]): ColumnBuilder<T> {
    this.#col.actions = [...actions];
    return this;
  }

  build(): TableColumn<T> {
    return this.#col;
  }
}
