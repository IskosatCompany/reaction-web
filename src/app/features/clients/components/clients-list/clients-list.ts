import { ChangeDetectionStrategy, Component } from '@angular/core';
import { of } from 'rxjs';
import { TableComponent } from '../../../../ui/components/table/table.component';
import {
  PaginatedTableDataSource,
  TableColumn,
  TableRowAction
} from '../../../../ui/components/table/table.model';

interface Client {
  name: string;
  email: string;
  phone: number;
}

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.scss',
  imports: [TableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsList {
  columns: TableColumn<Client>[] = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' }
  ];

  dataSource: PaginatedTableDataSource<Client> = {
    data$: of([
      { name: 'John Doe', email: 'john@example.com', phone: 1234567890 },
      { name: 'Jane Smith', email: 'jane@example.com', phone: 9876543210 }
    ])
  };

  actions: TableRowAction<Client>[] = [
    {
      id: 'action',
      icon: 'open_in_new'
    }
  ];
}
