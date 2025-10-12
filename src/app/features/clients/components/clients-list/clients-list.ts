import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { TableComponent } from '../../../../ui/components/table/table.component';
import {
  PaginatedTableDataSource,
  TableColumn,
  TableRowAction
} from '../../../../ui/components/table/table.model';
import { ClientsApiService } from '../../api/clients-api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Client, ClientForm } from '../../models/client.interface';
import { filter, Observable, startWith, Subject, switchMap } from 'rxjs';
import { ClientFormComponent } from '../client-form/client-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.html',
  styleUrl: './clients-list.scss',
  imports: [
    TableComponent,
    CardComponent,
    AsyncPipe,
    MatBottomSheetModule,
    MatIconModule,
    MatButtonModule
  ],
  providers: [ClientsApiService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsList {
  bottomSheet = inject(MatBottomSheet);
  isMobile = inject(IS_MOBILE);
  modal = inject(MatDialog);
  router = inject(Router);
  clientsApiService = inject(ClientsApiService);
  addClientSubject$ = new Subject<void>();
  refreshSubject$ = new Subject<void>();
  columns: TableColumn<Client>[] = [
    { id: 'name', label: 'Nome' },
    { id: 'email', label: 'Email' },
    { id: 'phoneNumber', label: 'Telefone' }
  ];

  dataSource: PaginatedTableDataSource<Client> = {
    data$: this.refreshSubject$.pipe(
      startWith(null),
      switchMap(() => this.clientsApiService.getClients())
    )
  };

  actions: TableRowAction<Client>[] = [
    {
      id: 'action',
      icon: 'open_in_new',
      tooltip: () => 'Ver detalhes',
      callback: (row) => {
        this.router.navigate(['clients', row.id]);
      }
    }
  ];

  constructor() {
    this.addClientSubject$
      .pipe(
        switchMap(() => this.openCreateClientBottomSheet()),
        filter((formValue) => !!formValue),
        switchMap((formValue) => this.clientsApiService.createClient(formValue)),
        takeUntilDestroyed()
      )
      .subscribe(() => this.refreshSubject$.next());
  }

  onClientClick(clientId: string): void {
    this.router.navigate(['clients', clientId]);
  }

  addClient(): void {
    this.addClientSubject$.next();
  }

  openCreateClientBottomSheet(): Observable<Partial<ClientForm> | undefined> {
    return this.bottomSheet
      .open<ClientFormComponent, Client | undefined, Partial<ClientForm>>(ClientFormComponent)
      .afterDismissed();
  }
}
