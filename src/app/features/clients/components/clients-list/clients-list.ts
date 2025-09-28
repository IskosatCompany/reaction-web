import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { of } from 'rxjs';
import { TableComponent } from '../../../../ui/components/table/table.component';
import {
  PaginatedTableDataSource,
  TableColumn,
  TableRowAction
} from '../../../../ui/components/table/table.model';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { AsyncPipe } from '@angular/common';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { Client } from '../../models/client.interface';
import { ClientsApiService } from '../../api/clients-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.scss',
  imports: [TableComponent, CardComponent, AsyncPipe],
  providers: [ClientsApiService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsList {
  isMobile = inject(IS_MOBILE);
  router = inject(Router);
  clientsApiService = inject(ClientsApiService);
  columns: TableColumn<Client>[] = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'phoneNumber', label: 'Phone' }
  ];

  dataSource: PaginatedTableDataSource<Client> = {
    data$: of([
      {
        id: '1',
        name: 'Acme Corp',
        email: 'info@acme.com',
        phoneNumber: '+1-555-1234',
        address: 'Address',
        birthDate: new Date()
      },
      {
        id: '2',
        name: 'Globex Inc',
        email: 'contact@globex.com',
        phoneNumber: '+1-555-5678',
        address: 'Address',
        birthDate: new Date()
      },
      {
        id: '3',
        name: 'Soylent Corp',
        email: 'hello@soylent.com',
        phoneNumber: '+1-555-8765',
        address: 'Address',
        birthDate: new Date()
      }
    ])
  };

  actions: TableRowAction<Client>[] = [
    {
      id: 'action',
      icon: 'open_in_new',
      callback: (row) => {
        this.router.navigate(['clients', row.id]);
      }
    }
  ];

  onClientClick(clientId: string): void {
    this.router.navigate(['clients', clientId]);
  }
}
