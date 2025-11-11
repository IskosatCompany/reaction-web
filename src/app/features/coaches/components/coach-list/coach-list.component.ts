import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { combineLatest, filter, Observable, startWith, Subject, switchMap } from 'rxjs';
import { IS_MOBILE } from '../../../../core/tokens/mobile.token';
import { CardComponent } from '../../../../ui/components/card/card.component';
import { TableComponent } from '../../../../ui/components/table/table.component';
import {
  PaginatedTableDataSource,
  TableColumn,
  TableRowAction
} from '../../../../ui/components/table/table.model';
import { CoachApiService } from '../../api/coach-api.service';
import { CoachBottomSheetData } from '../../models/coach-bottom-sheet-data.model';
import { Coach, CoachForm } from '../../models/coach.model';
import { CoachFormComponent } from '../coach-form/coach-form.component';
import { SearchComponent } from '../../../../ui/components/search/search.component';

@Component({
  selector: 'app-coach-list',
  imports: [
    TableComponent,
    CardComponent,
    SearchComponent,
    AsyncPipe,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './coach-list.component.html',
  styleUrl: './coach-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CoachListComponent {
  isMobile = inject(IS_MOBILE);
  bottomSheet = inject(MatBottomSheet);
  router = inject(Router);
  coachApiService = inject(CoachApiService);
  createCoachSubject$ = new Subject<void>();
  refreshSubject$ = new Subject<void>();
  searchSubject$ = new Subject<string>();
  columns: TableColumn<Coach>[] = [
    { id: 'employeeNumber', label: 'Número de Treinador', width: 200 },
    { id: 'name', label: 'Nome' },
    { id: 'email', label: 'Email' },
    { id: 'phoneNumber', label: 'Telefone' }
  ];

  dataSource: PaginatedTableDataSource<Coach> = {
    data$: combineLatest([
      this.searchSubject$.pipe(startWith('')),
      this.refreshSubject$.pipe(startWith(null))
    ]).pipe(switchMap(([searchTerm, _]) => this.coachApiService.getCoaches(searchTerm)))
  };
  actions: TableRowAction<Coach>[] = [
    {
      id: 'action',
      icon: 'open_in_new',
      tooltip: () => 'Ver detalhes',
      callback: (row) => {
        this.router.navigate(['team', row.id]);
      }
    }
  ];

  constructor() {
    this.createCoachSubject$
      .pipe(
        switchMap(() => this.openCreateCoachBottomSheet()),
        filter((coachForm) => !!coachForm),
        switchMap((coachForm) => this.coachApiService.addCoach(coachForm))
      )
      .subscribe(() => this.refreshSubject$.next());
  }

  onCoachClick(coachId: string): void {
    this.router.navigate(['team', coachId]);
  }

  createCoach(): void {
    this.createCoachSubject$.next();
  }

  openCreateCoachBottomSheet(): Observable<Partial<CoachForm> | undefined> {
    return this.bottomSheet
      .open<CoachFormComponent, CoachBottomSheetData, Partial<CoachForm>>(CoachFormComponent, {
        data: {
          expertiseOptions: this.coachApiService.getExpertises()
        }
      })
      .afterDismissed();
  }
}
