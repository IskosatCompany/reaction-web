import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router } from '@angular/router';
import { combineLatest, filter, Observable, startWith, Subject, switchMap } from 'rxjs';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { SearchComponent } from '../../../../ui/components/search/search.component';
import { ColumnBuilder } from '../../../../ui/components/table/models/table-column.builder';
import { TableBuilder } from '../../../../ui/components/table/models/table.builder';
import { TableComponent } from '../../../../ui/components/table/table.component';
import { formatClient } from '../../../../ui/helpers/client.helper';
import { AuthenticationService } from '../../../authentication/services/authentication.service';
import { ClientsApiService } from '../../api/clients-api.service';
import { Client, ClientForm } from '../../models/client.interface';
import { ClientFormComponent } from '../client-form/client-form.component';

@Component({
  selector: 'app-clients-list',
  templateUrl: './clients-list.component.html',
  styleUrl: './clients-list.component.scss',
  imports: [
    TableComponent,
    CardComponent,
    AsyncPipe,
    MatBottomSheetModule,
    MatIconModule,
    MatButtonModule,
    SearchComponent,
    MatSlideToggleModule
  ],
  providers: [ClientsApiService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsListComponent {
  authService = inject(AuthenticationService);
  bottomSheet = inject(MatBottomSheet);
  isMobile = inject(IS_MOBILE);
  modal = inject(MatDialog);
  router = inject(Router);
  clientsApiService = inject(ClientsApiService);
  addClientSubject$ = new Subject<void>();
  refreshSubject$ = new Subject<void>();
  searchSubject$ = new Subject<string>();
  showArchivedSubject$ = new Subject<boolean>();

  tableConfig = new TableBuilder<Client>()
    .column(
      new ColumnBuilder<Client>('client', 'Cliente')
        .cellFn((row) => formatClient(row.name, row.clientNumber))
        .build()
    )
    .column(new ColumnBuilder<Client>('email', 'Email').cellFn((row) => row.email).build())
    .column(
      new ColumnBuilder<Client>('phoneNumber', 'Telefone').cellFn((row) => row.phoneNumber).build()
    )
    .column(
      new ColumnBuilder<Client>('actions')
        .actions([
          {
            icon: 'open_in_new',
            tooltip: () => 'Ver detalhes',
            callback: (row) => this.router.navigate(['clients', row.id])
          }
        ])
        .build()
    )
    .fromObservable(
      combineLatest([
        this.searchSubject$.pipe(startWith('')),
        this.refreshSubject$.pipe(startWith(null)),
        this.showArchivedSubject$.pipe(startWith(false))
      ]).pipe(
        switchMap(([searchTerm, _, showArchivedClients]) =>
          this.clientsApiService.getClients(searchTerm, showArchivedClients)
        )
      )
    )
    .build();

  isAdmin = this.authService.isAdmin;

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
