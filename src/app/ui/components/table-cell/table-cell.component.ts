import { PortalModule, TemplatePortal } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  ViewContainerRef
} from '@angular/core';
import { TableColumn, TableData } from '../table/table.model';

@Component({
  selector: 'app-table-cell',
  imports: [PortalModule],
  templateUrl: './table-cell.component.html',
  styleUrl: './table-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'isDisabled()'
  }
})
export class TableCellComponent<T> {
  readonly #viewContainerRef = inject(ViewContainerRef);

  column = input.required<TableColumn<T>>();
  item = input.required<TableData<T>>();

  isDisabled = computed<boolean>(() => {
    const column = this.column();
    return column.isDisabled ? column.isDisabled(this.item()) : false;
  });

  template = computed<TemplatePortal | undefined>(() => {
    const column = this.column();
    const template = column.template;
    if (template) {
      return new TemplatePortal(template, this.#viewContainerRef, {
        row: this.item(),
        column: this.column()
      });
    }
    return undefined;
  });

  value = computed<string>(() => {
    const column = this.column();
    if (column.template || column.id === 'table-actions') {
      return '-';
    }
    return `${this.item()[column.id] ?? '-'}`;
  });
}
