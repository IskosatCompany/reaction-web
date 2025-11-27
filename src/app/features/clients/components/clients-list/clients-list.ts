import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
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
import { combineLatest, filter, Observable, startWith, Subject, switchMap } from 'rxjs';
import { ClientFormComponent } from '../client-form/client-form.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SearchComponent } from '../../../../ui/components/search/search.component';
import { UserRole } from '../../../authentication/models/login.interface';
import { AuthenticationService } from '../../../authentication/services/authentication.service';

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
    MatButtonModule,
    SearchComponent
  ],
  providers: [ClientsApiService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClientsList {
  authService = inject(AuthenticationService);
  bottomSheet = inject(MatBottomSheet);
  isMobile = inject(IS_MOBILE);
  modal = inject(MatDialog);
  router = inject(Router);
  clientsApiService = inject(ClientsApiService);
  addClientSubject$ = new Subject<void>();
  refreshSubject$ = new Subject<void>();
  searchSubject$ = new Subject<string>();
  columns: TableColumn<Client>[] = [
    { id: 'clientNumber', label: 'Número de Cliente', width: 200 },
    { id: 'name', label: 'Nome' },
    { id: 'email', label: 'Email' },
    { id: 'phoneNumber', label: 'Telefone' }
  ];

  dataSource: PaginatedTableDataSource<Client> = {
    data$: combineLatest([
      this.searchSubject$.pipe(startWith('')),
      this.refreshSubject$.pipe(startWith(null))
    ]).pipe(switchMap(([searchTerm, _]) => this.clientsApiService.getClients(searchTerm)))
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

  isAdmin = computed(
    () =>
      this.authService.userRole() === UserRole.admin ||
      this.authService.userId() === '0c2ed097-e49f-4281-a745-670f175c38a7'
  );

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
