import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TableData, TableRowAction } from '../table/table.model';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-table-actions-cell',
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './table-actions-cell.component.html',
  styleUrl: './table-actions-cell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableActionsCellComponent<T> {
  element = input.required<TableData<T>>();
  rowActions = input.required<TableRowAction<T>[]>();

  actions = computed<TableRowAction<T>[]>(() =>
    this.rowActions().filter((action) => {
      if (action.isDisabled) {
        return !action.isDisabled(this.element());
      }
      return true;
    })
  );
}
